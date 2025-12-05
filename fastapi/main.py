from fastapi import FastAPI, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import pandas as pd

app: FastAPI = FastAPI()

storage_path = os.path.join("storage")

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:4200"], allow_methods=["*"], allow_headers=["*"])

@app.post("/process")
async def upload_file(output_format, file):
    file_location = os.path.join(storage_path, "input_" + file.filename)
    file_extension = file.filename.split(".")[-1]
    # Read file and save to storage
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    supported_input_extensions = ["csv", "xlsx", "parquet"]
    if file_extension in supported_input_extensions and output_format in supported_input_extensions:
        if file_extension == "csv":
            df = pd.read_csv(file_location)
        elif file_extension in ["xls", "xlsx"]:
            df = pd.read_excel(file_location)
        else:
            df = pd.read_parquet(file_location)
    output_file_location = os.path.join(storage_path, "output." + output_format)
    if output_format == "csv":
        df.to_csv(output_file_location, index=False)
    elif output_format in ["xlsx"]:
        df.to_excel(output_file_location, index=False)
    else:
        df.to_parquet(output_file_location, index=False)
    return {"output_file": output_file_location}
