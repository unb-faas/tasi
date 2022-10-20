FROM index.docker.io/library/python:3.7-alpine
LABEL application="Tasi"
LABEL maintainer="University of Brasilia"
LABEL component="Findpapers"
WORKDIR "/findpapers"
RUN pip install findpapers uvicorn fastapi timeout-decorator
COPY . /findpapers
EXPOSE 8000
CMD uvicorn main:app --reload --host 0.0.0.0 --workers 20