cd src/backend && uvicorn app:app --reload --host 0.0.0.0 --port 8001

pip freeze > requirements.txt
https://pip.pypa.io/en/stable/cli/pip_freeze/