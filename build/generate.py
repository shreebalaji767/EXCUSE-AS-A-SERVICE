import json
import random
import hashlib
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent

OUTPUT = ROOT / "data" / "content.js"

TOTAL_CONVERSATIONS = 5000


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
    ("Client", "Freelancer")

]


SITUATIONS = [

    (
        "late",
        "The Timing Problem",
        "Why were you late?",
        [
            "There was a scheduling disagreement between me and the clock.",
            "I left on time. Unfortunately, time had other plans.",
            "I underestimated how committed traffic was to stopping me.",
            "I was early for a completely different version of today."
        ]
    ),

    (
        "reply",
        "The Missing Reply",
        "Why didn't you reply?",
        [
            "I read it and immediately became mentally unavailable.",
            "I was going to reply, but then replying became tomorrow's problem.",
            "I saw the message and accidentally gave it emotional importance instead of a response.",
            "I thought I replied. My brain clearly sent it somewhere else."
        ]
    ),

    (
        "meeting",
        "The Meeting Situation",
        "Why did you miss the meeting?",
        [
            "I attended mentally, but unfortunately my physical presence was unavailable.",
            "The meeting existed at a time when I was doing something else.",
            "I saw the reminder and successfully ignored it by accident.",
            "I misunderstood the calendar notification with impressive confidence."
        ]
    ),

    (
        "work",
        "The Unfinished Work",
        "Why isn't the work finished?",
        [
            "I was waiting for the perfect moment. It appears to be delayed.",
            "I completed the thinking portion. The physical execution is pending.",
            "The task became significantly more complicated after I opened it.",
            "I underestimated how much work was hidden inside the word simple."
        ]
    ),

    (
        "forgot",
        "The Memory Incident",
        "How did you forget?",
        [
            "I remembered that I had to remember something, but not what it was.",
            "The information was present briefly and then resigned.",
            "My memory cleared the cache at an unfortunate moment.",
            "I trusted myself to remember it without writing it down. That was ambitious."
        ]
    ),

    (
        "money",
        "The Financial Mystery",
        "Where did the money go?",
        [
            "It went toward things that seemed reasonable at the time.",
            "The money has entered a different financial ecosystem.",
            "It disappeared through a series of completely defensible decisions.",
            "I spent it before realizing I had spent it."
        ]
    ),

    (
        "homework",
        "The Homework Problem",
        "Why didn't you do the homework?",
        [
            "I was going to start after one small break.",
            "The break became unexpectedly successful.",
            "I understood the assignment. I simply didn't participate in it.",
            "I spent too much time preparing to begin."
        ]
    ),

    (
        "call",
        "The Missed Call",
        "Why didn't you answer my call?",
        [
            "My phone and I were temporarily not communicating.",
            "I saw it ringing and assumed it was testing me.",
            "I was holding the phone when it happened, which made it more embarrassing.",
            "I intended to call back immediately and then immediately became busy."
        ]
    ),

    (
        "deadline",
        "The Deadline Incident",
        "Why did you miss the deadline?",
        [
            "I misunderstood the relationship between deadline and actual time.",
            "I believed the deadline was more of a suggestion.",
            "I was working toward it until time unexpectedly continued.",
            "The deadline arrived before I was emotionally prepared."
        ]
    ),

    (
        "file",
        "The File Mystery",
        "Where is the file?",
        [
            "It was here five minutes ago, which is not helping us now.",
            "I named it something logical, which turned out to be the problem.",
            "The file exists. Its location is currently theoretical.",
            "I saved it somewhere I would definitely remember. I do not remember."
        ]
    ),

    (
        "plans",
        "The Plan Cancellation",
        "Why did you cancel?",
        [
            "My energy submitted a formal cancellation request.",
            "I became unexpectedly unavailable to myself.",
            "The plan looked better when it was theoretical.",
            "I remembered that leaving the house requires preparation."
        ]
    ),

    (
        "cleaning",
        "The Cleaning Excuse",
        "Why is your room still messy?",
        [
            "I'm using a system that has not yet been understood by outsiders.",
            "Everything is exactly where I left it.",
            "I know where most things are, which means the system is functional.",
            "I was going to clean it, but then I found something interesting."
        ]
    ),

    (
        "name",
        "The Name Problem",
        "Why did you forget my name?",
        [
            "I knew it, but my brain refused to provide it under pressure.",
            "The name was available yesterday.",
            "I recognized you immediately. The name was unfortunately missing.",
            "My brain temporarily replaced names with facial recognition."
        ]
    )

]


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
    "passive-aggressive"

]


FOLLOW_UPS = [

    "That doesn't really explain it.",
    "You expect me to believe that?",
    "That's your explanation?",
    "Could you explain that again?",
    "That somehow made it more confusing.",
    "I'm asking seriously.",
    "Please tell me you're joking.",
    "I have several questions.",
    "Interesting. Continue.",
    "I regret asking."

]


ENDINGS = [

    "Anyway, that's what happened.",
    "So technically, there was a reason.",
    "Let's consider the matter resolved.",
    "I have no additional comments.",
    "We can revisit this never.",
    "I believe that concludes the investigation.",
    "That's the official version.",
    "Let's move forward before this gets worse.",
    "I stand by everything I just said."

]


def transform(text, style):

    if style == "professional":

        return text + " At this time."


    if style == "corporate":

        return (
            "From an operational perspective, "
            + text.lower()
        )


    if style == "sarcastic":

        return text + " Obviously."


    if style == "idiotic":

        return (
            text +
            " This seemed completely logical at the time."
        )


    if style == "dark humor":

        return (
            text +
            " Everything is probably fine."
        )


    if style == "absurd":

        return (
            text +
            " A suspicious pigeon was also involved."
        )


    if style == "dramatic":

        return (
            text +
            " And that was the moment everything changed."
        )


    if style == "passive-aggressive":

        return (
            text +
            " But I'm sure that's completely understandable."
        )


    return text


def make_conversation(index):

    first, second = random.choice(
        CHARACTERS
    )


    situation_id, title, question, excuses = random.choice(
        SITUATIONS
    )


    style = random.choice(
        STYLES
    )


    messages = [

        {
            "speaker": first,
            "speakerId": 0,
            "text": question
        },

        {
            "speaker": second,
            "speakerId": 1,
            "text": transform(
                random.choice(excuses),
                style
            )
        },

        {
            "speaker": first,
            "speakerId": 0,
            "text": random.choice(
                FOLLOW_UPS
            )
        },

        {
            "speaker": second,
            "speakerId": 1,
            "text": random.choice(
                ENDINGS
            )
        }

    ]


    fingerprint = hashlib.sha256(
        json.dumps(
            messages,
            ensure_ascii=False
        ).encode("utf-8")
    ).hexdigest()[:16]


    return {

        "id":
            f"conversation-{index}-{fingerprint}",

        "title":
            title,

        "style":
            style,

        "situation":
            situation_id,

        "messages":
            messages

    }


def main():

    random.seed()

    conversations = []

    seen = set()


    while len(conversations) < TOTAL_CONVERSATIONS:

        conversation =
            make_conversation(
                len(conversations) + 1
            )


        key = json.dumps(
            conversation["messages"],
            sort_keys=True,
            ensure_ascii=False
        )


        if key in seen:

            continue


        seen.add(key)

        conversations.append(
            conversation
        )


    payload = {

        "generated": True,

        "count":
            len(conversations),

        "conversations":
            conversations

    }


    OUTPUT.parent.mkdir(
        exist_ok=True
    )


    OUTPUT.write_text(

        "window.EXCUSE_DATA = " +
        json.dumps(
            payload,
            ensure_ascii=False,
            separators=(",", ":")
        ) +
        ";",

        encoding="utf-8"

    )


    print(
        f"Generated {len(conversations)} conversations -> {OUTPUT}"
    )


if __name__ == "__main__":

    main()
