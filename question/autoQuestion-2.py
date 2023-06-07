# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import openai
import json

openai.api_key = "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"


def get_completion(prompt, model="gpt-4"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=1.3,  # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]

def get_title(text):
    prompt = f"""
            Here is a test platform. You should extract the topic of the question
            delimited by triple backticks
            ```{text}```
            """
    return get_completion(prompt)

def get_question(topic):
    text = f"""
        answer_index: ""
        answer_options: 
            0: 
            1:
            2:
            3:
        code: ""
        explanation : " "!" in Java is equivalent to "not" in Python."
        hint : "this is a hint"
        id : "id"
        question :"sample question"
        """
    prompt = f"""
        Here is a test platform which can generate choice questions. You should generate a similar question like the format\
        delimited by triple backticks
        ```{text}```
        'question' is a random programming question, it must related to {topic}.
        There are only 4 options in 'answer_options', '0', '1', '2', '3'. It is determined.
        'answer_index' field indicates which answer is right. There's only one answer.
        keep 'code' an empty field, since it's a multi-choice problem.
        'explanation' should be related to the 'question' or 'answer_options'.
        Provide them in JSON format(the JSON format should be correct so I can use json library in Python)
        You should only return the JSON string without other thing.
        """
    return get_completion(prompt)

def get_answer(question):
    prompt = f"""
            Give me the code required by the question delimited by triple backticks
            ```{question}```
            """
    answer = get_completion(prompt)
    return answer

def generate(topic, id):
    fields = get_question(topic)
    question = json.loads(fields)
    question["id"] = id
    return json.dumps(question, indent=4)

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    import os

    # os.environ["http_proxy"] = "127.0.0.1:4780"
    # os.environ["https_proxy"] = "127.0.0.1:4780"
    topic = input("input your topic:")
    topic = get_title(topic)
    # for id in range(3):
        # q = generate(topic, id)
        # print(q)

    with open('./question/output.txt', 'w') as f:
        for id in range(3):
            q = generate(topic, id)
            f.write(q + '\n')



# See PyCharm help at https://www.jetbrains.com/help/pycharm/
