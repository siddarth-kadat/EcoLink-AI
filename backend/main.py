# pyrefly: ignore [missing-import]
from typing import Dict, Literal, get_origin, get_args
from fastapi import FastAPI
import pydantic.json_schema

# Monkeypatch GenerateJsonSchema.build_schema_type_to_method to resolve nested Literals in Python 3.9
original_build_schema_type_to_method = pydantic.json_schema.GenerateJsonSchema.build_schema_type_to_method

def patched_build_schema_type_to_method(self):
    from pydantic.json_schema import CoreSchemaOrFieldType
    
    def unpack_literal(annotation):
        origin = get_origin(annotation)
        if origin is Literal:
            unpacked = []
            for arg in get_args(annotation):
                if get_origin(arg) is Literal:
                    unpacked.extend(unpack_literal(arg))
                else:
                    unpacked.append(arg)
            return unpacked
        return [annotation]

    unpacked_keys = unpack_literal(CoreSchemaOrFieldType)
    
    mapping = {}
    for key in unpacked_keys:
        if isinstance(key, str):
            method_name = f'{key.replace("-", "_")}_schema'
            try:
                mapping[key] = getattr(self, method_name)
            except AttributeError as e:
                import os
                if os.getenv('PYDANTIC_PRIVATE_ALLOW_UNHANDLED_SCHEMA_TYPES'):
                    continue
                raise TypeError(
                    f'No method for generating JsonSchema for core_schema.type={key!r} '
                    f'(expected: {type(self).__name__}.{method_name})'
                ) from e
    return mapping

pydantic.json_schema.GenerateJsonSchema.build_schema_type_to_method = patched_build_schema_type_to_method

from app.routes.donations import router as donation_router
from app.routes.recommendations import router as recommendation_router
from app.routes.auth import router as auth_router
from app.routes.ngo import router as ngo_router
from app.routes.volunteer import router as volunteer_router
from app.routes.dashboard import router as dashboard_router

app = FastAPI(
    title="EcoLink AI API",
    version="1.0.0"
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(donation_router, prefix="/api/v1")
app.include_router(recommendation_router, prefix="/api/v1")
app.include_router(auth_router)
app.include_router(ngo_router)
app.include_router(volunteer_router)
app.include_router(dashboard_router)


@app.get("/", summary="Health Check")
def health_check() -> Dict[str, str]:
    """
    Root health check endpoint to verify that the API is running.
    """
    return {"message": "EcoLink AI API is running"}
