import json
import random
import hashlib
from pathlib import Path

# ============================================================
# CONFIGURATION
# ============================================================

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
DATA_DIR.mkdir(exist_ok=True)

OUTPUT = DATA_DIR / "content.js"

TOTAL_CONVERSATIONS = 5000

random.seed()


# ============================================================
# CHARACTERS
# ============================================================

CHARACTERS = [
    ("Boss", "Employee"),
    ("Manager", "Employee"),
    ("Teacher", "Student"),
    ("Professor", "Student"),
    ("Mother", "Child"),
    ("Father", "Child"),
    ("Friend", "Friend"),
    ("Partner", "Partner"),
    ("Customer", "Employee"),
    ("Coworker", "Coworker"),
    ("Neighbour", "Resident"),
    ("Doctor", "Patient"),
    ("Landlord", "Tenant"),
    ("Sibling", "Sibling"),
    ("Interviewer", "Candidate"),
    ("Client", "Freelancer"),
]


# ============================================================
# SITUATIONS
# ============================================================

SITUATIONS = [
    {
        "name": "late",
        "title": "The Timing Problem",
        "question": "Why were you late?",
        "responses": [
            "I wasn't late. I arrived after the correct time had already passed.",
            "There was a scheduling disagreement between me and the clock.",
            "I was physically present, just not at the expected time.",
            "I left on time. Unfortunately, time had other plans.",
            "I underestimated how committed traffic was to stopping me.",
            "I was early for a completely different version of today.",
        ]
    },
    {
        "name": "reply",
        "title": "The Missing Reply",
        "question": "Why didn't you reply?",
        "responses": [
            "I read it and immediately became mentally unavailable.",
            "I was going to reply, but then replying became tomorrow's problem.",
            "I saw the message and accidentally gave it emotional importance instead of a response.",
            "I drafted a reply internally. Unfortunately, it never reached the keyboard.",
            "I thought I replied. My brain clearly sent it somewhere else.",
            "I needed time to formulate a response and then forgot what the question was.",
        ]
    },
    {
        "name": "meeting",
        "title": "The Meeting Situation",
        "question": "Why did you miss the meeting?",
        "responses": [
            "I attended mentally, but unfortunately my physical presence was unavailable.",
            "The meeting existed at a time when I was doing something else.",
            "I saw the reminder and successfully ignored it by accident.",
            "I misunderstood the calendar notification with impressive confidence.",
            "I thought someone else was representing my absence.",
            "I was preparing to join until the meeting almost finished.",
        ]
    },
    {
        "name": "work",
        "title": "The Unfinished Work",
        "question": "Why isn't the work finished?",
        "responses": [
            "I was waiting for the perfect moment. It appears to be delayed.",
            "I completed the thinking portion. The physical execution is pending.",
            "The task became significantly more complicated after I opened it.",
            "I underestimated how much work was hidden inside the word 'simple'.",
            "I made excellent progress toward eventually starting it.",
            "The work is technically in progress. The progress is just difficult to observe.",
        ]
    },
    {
        "name": "forgot",
        "title": "The Memory Incident",
        "question": "How did you forget?",
        "responses": [
            "I remembered that I had to remember something, but not what it was.",
            "The information was present briefly and then resigned.",
            "My memory cleared the cache at an unfortunate moment.",
            "I trusted myself to remember it without writing it down. That was ambitious.",
            "I remembered it approximately three minutes after it became useful.",
            "It was stored somewhere in my brain. The search function failed.",
        ]
    },
    {
        "name": "money",
        "title": "The Financial Mystery",
        "question": "Where did the money go?",
        "responses": [
            "It went toward things that seemed reasonable at the time.",
            "The money has entered a different financial ecosystem.",
            "I don't know, but apparently it had somewhere important to be.",
            "It disappeared through a series of completely defensible decisions.",
            "I spent it before realizing I had spent it.",
            "The account balance and I have different opinions about the situation.",
        ]
    },
    {
        "name": "homework",
        "title": "The Homework Problem",
        "question": "Why didn't you do the homework?",
        "responses": [
            "I was going to start after one small break.",
            "The break became unexpectedly successful.",
            "I understood the assignment. I simply didn't participate in it.",
            "I spent too much time preparing to begin.",
            "I opened the notebook, which I consider the first milestone.",
            "I was waiting for inspiration. Inspiration apparently took the day off.",
        ]
    },
    {
        "name": "call",
        "title": "The Missed Call",
        "question": "Why didn't you answer my call?",
        "responses": [
            "My phone and I were temporarily not communicating.",
            "I saw it ringing and assumed it was testing me.",
            "I was holding the phone when it happened, which made it more embarrassing.",
            "I intended to call back immediately and then immediately became busy.",
            "The call arrived during a period of extremely poor availability.",
            "I was unavailable in a very available-looking location.",
        ]
    },
    {
        "name": "deadline",
        "title": "The Deadline Incident",
        "question": "Why did you miss the deadline?",
        "responses": [
            "I misunderstood the relationship between 'deadline' and actual time.",
            "I believed the deadline was more of a suggestion.",
            "I was working toward it until time unexpectedly continued.",
            "The deadline arrived before I was emotionally prepared.",
            "I planned around the deadline rather than toward it.",
            "I was extremely close. Unfortunately, deadlines don't award participation points.",
        ]
    },
    {
        "name": "file",
        "title": "The File Mystery",
        "question": "Where is the file?",
        "responses": [
            "It was here five minutes ago, which is not helping us now.",
            "I named it something logical, which turned out to be the problem.",
            "The file exists. Its location is currently theoretical.",
            "I saved it somewhere I would definitely remember. I do not remember.",
            "There are seventeen versions and somehow none of them are the correct one.",
            "The file and I have temporarily gone our separate ways.",
        ]
    },
    {
        "name": "plans",
        "title": "The Plan Cancellation",
        "question": "Why did you cancel?",
        "responses": [
            "My energy submitted a formal cancellation request.",
            "I became unexpectedly unavailable to myself.",
            "The plan looked better when it was theoretical.",
            "I remembered that leaving the house requires preparation.",
            "I was technically free, but not emotionally available for the concept.",
            "The plan encountered unforeseen resistance from my motivation.",
        ]
    },
    {
        "name": "cleaning",
        "title": "The Cleaning Excuse",
        "question": "Why is your room still messy?",
        "responses": [
            "I'm using a system that has not yet been understood by outsiders.",
            "Everything is exactly where I left it.",
            "I know where most things are, which means the system is functional.",
            "I was going to clean it, but then I found something interesting.",
            "The room is not messy. It is aggressively organized.",
            "I am currently between cleaning phases.",
        ]
    },
    {
        "name": "name",
        "title": "The Name Problem",
        "question": "Why did you forget my name?",
        "responses": [
            "I knew it, but my brain refused to provide it under pressure.",
            "The name was available yesterday.",
            "I recognized you immediately. The name was unfortunately missing.",
            "My brain temporarily replaced names with facial recognition.",
            "I knew exactly who you were. That was the problem.",
            "The name was loading.",
        ]
    },
]


# ============================================================
# STYLES
# ============================================================

STYLES = [
    "believable",
    "professional",
    "casual",
    "sarcastic",
    "idiotic",
    "dark humor",
    "absurd",
    "corporate",
    "dramatic",
    "passive-aggressive",
]


# ============================================================
# STYLE TRANSFORMATIONS
# ============================================================

def style_text(text, style):
    if style == "professional":
        return text.replace(".", " at this time.")

    if style == "corporate":
        return (
            "From an operational perspective, "
            + text.lower()
        )

    if style == "sarcastic":
        return text + " Obviously."

    if style == "idiotic":
        return text + " This seemed completely logical at the time."

    if style == "dark humor":
        return text + " Everything is probably fine."

    if style == "absurd":
        return text + " The situation was also being monitored by a suspicious pigeon."

    if style == "dramatic":
        return text + " And that was the moment everything changed."

    if style == "passive-aggressive":
        return text + " But I'm sure that's completely understandable."

    if style == "casual":
        return text

    return text


# ============================================================
# EXTRA FOLLOW-UPS
# ============================================================

FOLLOW_UPS = [
    "That doesn't really explain it.",
    "You expect me to believe that?",
    "That's your explanation?",
    "Could you explain that again?",
    "That somehow made it more confusing.",
    "I'm asking seriously.",
    "Please tell me you're joking.",
    "I have several questions.",
    "That is not what I expected to hear.",
    "And you thought this was acceptable?",
    "Interesting. Continue.",
    "I regret asking.",
]


ENDING_LINES = [
    "Anyway, that's what happened.",
    "So technically, there was a reason.",
    "I would appreciate not discussing this further.",
    "Let's consider the matter resolved.",
    "I have no additional comments.",
    "We can revisit this never.",
    "I believe that concludes the investigation.",
    "That's the official version.",
    "Let's move forward before this gets worse.",
    "I stand by everything I just said.",
]


# ============================================================
# CREATE ONE CONVERSATION
# ============================================================

def make_conversation(index):
    role1, role2 = random.choice(CHARACTERS)
    situation = random.choice(SITUATIONS)
    style = random.choice(STYLES)

    question = situation["question"]
    response = random.choice(situation["responses"])

    response = style_text(response, style)

    follow = random.choice(FOLLOW_UPS)
    ending = random.choice(ENDING_LINES)

    messages = [
        {
            "speaker": role1,
            "text": question
        },
        {
            "speaker": role2,
            "text": response
        },
        {
            "speaker": role1,
            "text": follow
        },
        {
            "speaker": role2,
            "text": ending
        }
    ]

    fingerprint_source = "|".join(
        f"{m['speaker']}:{m['text']}"
        for m in messages
    )

    fingerprint = hashlib.sha256(
        fingerprint_source.encode("utf-8")
    ).hexdigest()[:16]

    return {
        "id": f"conversation-{index}-{fingerprint}",
        "style": style,
        "title": situation["title"],
        "situation": situation["name"],
        "messages": messages
    }


# ============================================================
# GENERATE UNIQUE CONVERSATIONS
# ============================================================

def generate():
    conversations = []
    fingerprints = set()

    attempts = 0
    max_attempts = TOTAL_CONVERSATIONS * 50

    while len(conversations) < TOTAL_CONVERSATIONS:
        attempts += 1

        if attempts > max_attempts:
            break

        conversation = make_conversation(
            len(conversations) + 1
        )

        fingerprint = json.dumps(
            conversation["messages"],
            sort_keys=True,
            ensure_ascii=False
        )

        if fingerprint in fingerprints:
            continue

        fingerprints.add(fingerprint)
        conversations.append(conversation)

    return conversations


# ============================================================
# WRITE JAVASCRIPT DATA
# ============================================================

def write_file(conversations):
    payload = {
        "generated": True,
        "count": len(conversations),
        "conversations": conversations
    }

    javascript = (
        "window.EXCUSE_DATA = "
        + json.dumps(
            payload,
            ensure_ascii=False,
            separators=(",", ":")
        )
        + ";"
    )

    OUTPUT.write_text(
        javascript,
        encoding="utf-8"
    )


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    print("Generating conversations...")

    conversations = generate()

    write_file(conversations)

    print()
    print("DONE")
    print(f"Generated: {len(conversations)} conversations")
    print(f"Output: {OUTPUT}")
    print()
    print("Every conversation contains:")
    print("  - speaker")
    print("  - text")
    print("  - style")
    print("  - title")
    print("  - situation")
