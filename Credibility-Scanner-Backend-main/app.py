import json
import numpy as np
from flask import Flask, request, jsonify, render_template
import pickle
import pandas as pd

# Create flask app
flask_app = Flask(__name__)
model = pickle.load(open("phishing_p.pkl", "rb"))
scalar = pickle.load(open("scalar.pkl", "rb"))

@flask_app.route("/")
def Home():
    return render_template("index.html")


# Pickel the scaling ...........
@flask_app.route("/predict", methods = ["POST"])
def predict_with_features():
    data = request.data
    data = json.loads(data)
    df = pd.DataFrame(data, index=[0])
    df = scalar.transform(df)
    pred = model.predict(df)
    print(pred[0])
    return jsonify({"message": "We got your data ......", "status": pred[0]}) # return result from pickeling instead . 


if __name__ == "__main__":
    flask_app.run(debug=True)