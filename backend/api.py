import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get('/{name}')
def hello_name(name : str): 
    # Defining a function that takes only string as input and output the
    # following message. 
    return {'message': f'Welcome to SpoofOrNot!, {name}'}

# model = joblib.load('model/model.pkl')

# #Processing function
# def preprocessor(text):
#     text = re.sub('<[^>]*>', '', text) # Effectively removes HTML markup tags
#     emoticons = re.findall('(?::|;|=)(?:-)?(?:\)|\(|D|P)', text)
#     text = re.sub('[\W]+', ' ', text.lower()) + ' '.join(emoticons).replace('-', '')
#     return text

# #Model prediction function
# def classify_message(model, message):

# 	message = preprocessor(message)
# 	label = model.predict([message])[0]
# 	spam_prob = model.predict_proba([message])

# 	return {'label': label, 'spam_probability': spam_prob[0][1]}

