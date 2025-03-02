import json
import requests
import re
from collections import defaultdict

def fetch_emoji_data():
    url = "https://unicode.org/Public/emoji/latest/emoji-test.txt"
    response = requests.get(url)
    return response.text

def fetch_cldr_annotations():
    url = "https://raw.githubusercontent.com/unicode-org/cldr/main/common/annotations/en.xml"
    response = requests.get(url)
    return response.text

def parse_emoji_data(data):
    emoji_dict = {}
    for line in data.split('\n'):
        if '; fully-qualified' in line:
            match = re.match(r'([0-9A-F ]+)\s+;\s+fully-qualified\s+#\s+(\S+)\s+(.+)', line)
            if match:
                code_points, character, name = match.groups()
                code_point = 'U+' + code_points.replace(' ', '_')
                emoji_dict[character] = {'codePoint': code_point, 'name': name.strip()}
    return emoji_dict

def parse_cldr_annotations(data):
    annotations = defaultdict(list)
    for line in data.split('\n'):
        if '<annotation cp="' in line:
            match = re.search(r'<annotation cp="(.+)">(.+)</annotation>', line)
            if match:
                character, keywords = match.groups()
                annotations[character].extend(keywords.split('|'))
    return annotations

def generate_emoji_json():
    emoji_data = fetch_emoji_data()
    cldr_data = fetch_cldr_annotations()

    emoji_dict = parse_emoji_data(emoji_data)
    annotations = parse_cldr_annotations(cldr_data)

    emoji_list = []
    for character, data in emoji_dict.items():
        emoji_info = {
            'character': character,
            'codePoint': data['codePoint'],
            'name': data['name'],
            'keywords': annotations.get(character, [])
        }
        emoji_list.append(emoji_info)

    return json.dumps({'emojis': emoji_list}, ensure_ascii=False, indent=2)

# Generate and save the JSON file
emoji_json = generate_emoji_json()
with open('emoji_data.json', 'w', encoding='utf-8') as f:
    f.write(emoji_json)

print("Emoji data has been saved to emoji_data.json")