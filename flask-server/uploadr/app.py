from flask import Flask, request, redirect, url_for, jsonify, render_template
from flask_cors import CORS
import os
import json
import glob
import re
from rake_nltk import Rake
from uuid import uuid4

app = Flask(__name__)
CORS(app)

@app.route("/upload", methods=["POST"])
def upload():
    articles = request.get_json()
    processed = []
    for article in articles['data']:
        processed.append(process_article(article))
    return jsonify(processed)

def get_author(text):
    author = re.compile('author{(.*?)}', re.MULTILINE)
    author = re.findall(author,text)
    if author:
        return author[0]
    return ""

def get_title(text):
    title = re.compile('title{(.*?)}', re.DOTALL)
    title = re.findall(title,text)[0]
    return title

def get_abstract_keywords(text):
    abstract = re.compile('begin{abstract}(.*?)\\\\end{abstract}', re.DOTALL)
    abstract = re.findall(abstract,text)
    if len(abstract) == 0:
        return [], 1
    abstract = abstract[0]
    abstract.replace("\n","")
    rake = Rake()
    rake.extract_keywords_from_text(abstract)
    abstract_keywords = rake.get_ranked_phrases_with_scores()
    return abstract_keywords, abstract_keywords[0][0]

def get_keywords(text):
    keywords = re.compile('begin{keyword}(.*?)\\\\end{keyword}', re.DOTALL)
    keywords = re.findall(keywords,text)
    if len(keywords) == 0:
        return []
    keywords = keywords[0].split(",")
    keywords = [keyword.replace("\n","") for keyword in keywords]
    return keywords

def get_concatenated_keywords(text):
    keywords = get_keywords(text)
    abstract_keywords, max_rank = get_abstract_keywords(text)
    concatenated_keywords = []
    for keyword in keywords:
        concatenated_keywords.append({'value': max_rank * 2, 'word': keyword})
    for rank, keyword in abstract_keywords:
        concatenated_keywords.append({'value': rank, 'word': keyword})
    return concatenated_keywords

def process_article(text):
    author = get_author(text)
    title = get_title(text)
    keywords = get_concatenated_keywords(text)
    return {'author': author, 'title': title, 'keywords': keywords}