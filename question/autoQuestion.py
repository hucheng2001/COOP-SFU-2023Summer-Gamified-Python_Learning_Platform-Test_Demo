# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import openai
import json

openai.api_key = "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"


def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages = messages,
        # temperature=0.2,
        max_tokens=1000,
        # frequency_penalty=2,
        # model=model,
        # messages=messages,
        temperature=1,  # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]

def get_question():
    text = f"""
        answer: ""
        difficulty: "🟢(Easy), 🟠(Medium) or 🔴(High)"
        hint: "sample hint"
        id: "0"
        question: "Write a Python program to determine the type of triangle"
        startercode: "
        # Use these variables to check your output\na = 3\nb=4\nc=7"
        title: "Triangles!"
        """
    prompt = f"""
        Here is a test platform. You should generate a similar question like the format\
        delimited by triple backticks
        ```{text}```
        'question' is a random programming question(You don't need it to be always related to 'Triangle')
        in the 'answer' field, keep it empty
        in the 'difficulty' field, you should only give the emoji without any text
        Provide them in JSON format ther I can collection into Firestore database, in the collection quiz-questions -> loops.
        """
    return get_completion(prompt)

def get_answer(question):
    prompt = f"""
            Give me the code required by the question delimited by triple backticks
            ```{question}```
            """
    answer = get_completion(prompt)
    return answer

def generate(id):
    fields = get_question()
    dict = json.loads(fields)
    question = dict["question"]
    dict["answer"] = get_answer(question)
    dict["id"] = id
    return json.dumps(dict, indent=4)

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    import os

    # os.environ["http_proxy"] = "127.0.0.1:4780"
    # os.environ["https_proxy"] = "127.0.0.1:4780"
    
    # for id in range(3):
        # q = generate(id)
        # print(q)
    with open('output.txt', 'w') as f:
        for id in range(3):
            q = generate(id)
            f.write(q + '\n')
        



