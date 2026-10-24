"""Build site/content.js from the package's class-content.json.

Only visitor-facing fields go out. Full-replay chapters use replay_seconds;
practice chapters use standalone_chapters[].practice_seconds. Nothing else
(source times, outer bounds, production notes) is carried into the page.
"""
import json, sys, datetime

src, out = sys.argv[1], sys.argv[2]
c = json.load(open(src, encoding='utf-8'))

def fix(text):
    t = text.strip()
    if t and t[-1] not in '.!?”"':
        t += '.'          # "Let the voice rest: reset, move, shake" -> add the missing full stop
    return t

d = datetime.date.fromisoformat(c['class_date'])
date_label = f"{d.strftime('%B')} {d.day}, {d.year}"

replay = {
    'id': 'replay',
    'title': 'Full class replay',
    'kind': 'Class recording',
    'duration': c['replay_duration_seconds'],
    'audio': 'replay-audio',
    'parts': [
        {
            'n': p['number'],
            'title': p['title'],
            'chapters': [{'t': ch['replay_seconds'], 'title': ch['title']} for ch in p['chapters']],
        }
        for p in c['parts']
    ],
}

# From "03 - Haiku Exploration - Outline.md" ("Haiku used in class").
HAIKU = {'haiku-play': ['An old silent pond…', 'A frog jumps into the pond, splash!', 'Silence again.']}
HAIKU_BY = {'haiku-play': 'Matsuo Bashō'}   # shown under the poem

practices = []
for i, p in enumerate(c['practices']):
    practices.append({
        'haiku': HAIKU.get(p['id']),
        'haikuBy': HAIKU_BY.get(p['id']),
        'id': p['id'],
        'n': i + 1,
        'title': p['title'],
        'fn': p['function'],
        'outline': [fix(x) for x in p['page_outline']],
        'duration': p['standalone_duration_seconds'],
        'audio': p['id'],
        'chapters': [{'t': ch['practice_seconds'], 'title': ch['title']} for ch in p['standalone_chapters']],
    })

content = {
    'series': 'Body Mapping',
    'title': 'Finding Ease in Your Voice',
    'date': date_label,
    'replay': replay,
    'practices': practices,
}

with open(out, 'w', encoding='utf-8') as f:
    f.write('// Generated from class-content.json by build/make_content.py. Edit the JSON and rebuild,\n')
    f.write('// or edit the copy here directly. Times are seconds into each recording.\n')
    f.write('window.CONTENT = ')
    json.dump(content, f, ensure_ascii=False, indent=2)
    f.write(';\n')
print('ok', len(practices), 'practices,', sum(len(p['chapters']) for p in replay['parts']), 'replay chapters')
