from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

class PatientHistory(BaseModel):
    diagnosis: str
    medication: str
    allergies: str

class DiagnosisRequest(BaseModel):
    patient_symptoms_text: str
    patient_history_data: List[PatientHistory]

def construct_prompt(symptoms: str, history: List[PatientHistory]) -> str:
    """Constructs a detailed prompt for the MedGemma model."""
    history_str = "\\n".join([f"- {h.diagnosis} (medication: {h.medication}, allergies: {h.allergies})" for h in history])
    prompt = f"""
    Analyze the following patient data and provide a differential diagnosis, follow-up questions, and recommended tests.
    The output must be a single, valid JSON object.

    Patient Symptoms:
    {symptoms}

    Patient History:
    {history_str}

    Based on the patient's symptoms and history, provide the following:
    1. A differential diagnosis with 3 possibilities, each with a confidence score and rationale.
    2. A list of 5 essential follow-up questions for the doctor to ask the patient.
    3. A list of 3 recommended initial diagnostic tests.
    """
    return prompt

def mock_medgemma(prompt: str) -> Dict:
    """Mocks the response from the MedGemma model."""
    return {
        "differential_diagnosis": [
            {"diagnosis": "Migraine", "confidence": "0.7", "rationale": "Patient's symptoms of headache and sensitivity to light are consistent with a migraine."},
            {"diagnosis": "Tension Headache", "confidence": "0.2", "rationale": "The patient's headache could also be a tension headache, but the other symptoms make migraine more likely."},
            {"diagnosis": "Sinusitis", "confidence": "0.1", "rationale": "Sinusitis can cause headaches, but the patient is not reporting other common symptoms like nasal congestion."}
        ],
        "follow_up_questions": [
            "How long have you been experiencing these headaches?",
            "Do you have a history of migraines in your family?",
            "Have you noticed any triggers for your headaches?",
            "Are you experiencing any other symptoms, such as nausea or vomiting?",
            "Have you taken any medication for your headaches?"
        ],
        "recommended_tests": [
            "Neurological exam",
            "CT scan of the head",
            "Blood tests"
        ]
    }

@app.post("/ai/diagnose")
async def diagnose(request: DiagnosisRequest):
    prompt = construct_prompt(request.patient_symptoms_text, request.patient_history_data)
    response = mock_medgemma(prompt)
    return response
