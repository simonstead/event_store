FROM python:3-onbuild

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_APP=app.py

ENV FLASK_DEBUG=1

CMD [ "flask", "run", "--host=0.0.0.0" ]
