from flask import Flask, request, redirect, url_for, jsonify, render_template
from flask_cors import CORS
import os
import json
import glob
import math
import re
from rake_nltk import Rake
from uuid import uuid4
import random

app = Flask(__name__)
CORS(app)

@app.route("/upload", methods=["POST"])
def upload():
    articles = request.get_json()
    processed = []
    for article in articles['data']:
        processed.append(process_article(article))
    sorted_articles = sorted(processed, key=lambda k: k['date'])
    similarity = calc_similarity(sorted_articles)
    return jsonify({'articles': sorted_articles, 'similarity': similarity, 'aggregated': aggregate_articles(sorted_articles)})

def get_author(text):
    author = re.compile('author{(.*?)}', re.MULTILINE)
    author = re.findall(author,text)
    if author:
        return author
    return ""

def get_title(text):
    title = re.compile('title{(.*?)}', re.DOTALL)
    title = re.findall(title,text)[0]
    return title

def get_date(text):
    date = re.compile('date{(.*?)}', re.DOTALL)
    date = re.findall(date, text)[0]
    return date

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
        concatenated_keywords.append({'value': max_rank/max_rank + random.randint(1,5), 'word': keyword.strip()})
    for rank, keyword in abstract_keywords:
        concatenated_keywords.append({'value': rank/max_rank, 'word': keyword.strip()})
    return concatenated_keywords

def process_article(text):
    author = get_author(text)
    title = get_title(text)
    date = get_date(text)
    keywords = get_concatenated_keywords(text)
    return {'author': author, 'title': title, 'keywords': keywords, 'date': date}

def calc_similarity(articles):
    similarity_dict = {}
    for article in articles:
        article['similarity_dict'] = {}
        keywords = article['keywords']
        for _article in articles:
            if article['title'] == _article['title']:
                continue
            _keywords = _article['keywords']
            for _keyword in _keywords:
                for keyword in keywords:
                    if _keyword['word'] == keyword['word']:
                        if _article['title'] not in article['similarity_dict']:
                            article['similarity_dict'][_article['title']] = []
                        article['similarity_dict'][_article['title']].append(_keyword['word'])
    return similarity_dict


def aggregate_articles(articles):
    result = []
    items_to_aggregate = 4
    iters = math.ceil(len(articles) / items_to_aggregate)
    for i in range(0,iters):
        if i == 3:
            last_date = articles[-1]['date']
        else:
            last_date = articles[(i+1)*items_to_aggregate-1]['date']
        print(last_date)
        top_keywords = []    
        for j in range(i*items_to_aggregate, i*items_to_aggregate + items_to_aggregate):
            if len(articles) <= j:
                continue
            for keyword in articles[j]['keywords']:
                found = False
                for _k in top_keywords:
                    if keyword['word'] == _k['word']:
                        found = True
                        #_k['value'] = _k['value'] + keyword['value']
                if found == False:
                    top_keywords.append(keyword)
        
        result.append({'date': last_date, 'value': top_keywords})
    return list(result)
