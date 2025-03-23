from pydantic import BaseModel


class ExecutePhase(BaseModel):
    inputs: dict
    type: str