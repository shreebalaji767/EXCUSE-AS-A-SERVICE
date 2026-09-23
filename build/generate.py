"""
EXCUSE-AS-A-SERVICE
Static content generator

Run from the project root:

    python build/generate.py

This generates:

    data/content.js

No database.
No API.
No external services.
"""

from __future__ import annotations

import json
import random
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
OUTPUT_FILE = DATA_DIR / "content.js"

DATA_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# SETTINGS
# ============================================================

RANDOM_SEED = 20260923
TARGET_CONVERSATIONS = 5000

random.seed(RANDOM_SEED)


# ============================================================
# CHARACTER PAIRS
# ============================================================

CHARACTER_PAIRS = [
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
    ("Team Lead", "Developer"),
    ("HR", "Employee"),
    ("Supervisor", "Worker"),
    ("Roommate", "Roommate"),
]


# ============================================================
# SITUATIONS
# ============================================================

SITUATIONS = [
    "late",
    "missed the meeting",
    "did not reply",
    "did not answer the call",
    "forgot something important",
    "missed the deadline",
    "did not finish the work",
    "sent the wrong file",
    "forgot the homework",
    "did not attend the class",
    "arrived late",
    "forgot the appointment",
    "cancelled the plans",
    "did not clean the room",
    "did not pay on time",
    "forgot the name",
    "did not submit the report",
    "lost the document",
    "did not send the email",
    "did not complete the task",
    "did not call back",
    "did not attend the interview",
    "missed the train",
    "missed the bus",
    "forgot the keys",
    "forgot the password",
    "did not bring the required item",
    "did not wake up",
    "ignored the reminder",
    "was unavailable",
]


# ============================================================
# STYLE NAMES
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
# STYLE DESCRIPTIONS
# ============================================================

STYLE_DESCRIPTIONS = {
    "believable": "A realistic excuse that could actually work.",
    "professional": "A polished workplace-friendly explanation.",
    "casual": "A relaxed everyday excuse.",
    "sarcastic": "A sarcastic excuse that sounds deliberately unhelpful.",
    "idiotic": "A spectacularly stupid excuse.",
    "dark humor": "A darkly humorous excuse.",
    "absurd": "An obviously ridiculous excuse.",
    "corporate": "Corporate language used to explain an avoidable disaster.",
    "dramatic": "An unnecessarily dramatic explanation.",
    "passive-aggressive": "An excuse that quietly blames everyone else.",
}


# ============================================================
# GENERIC QUESTIONS
# ============================================================

QUESTION_TEMPLATES = {
    "late": [
        "Why are you late?",
        "What happened? You were supposed to be here earlier.",
        "Why did you arrive so late?",
        "We were expecting you earlier. What happened?",
    ],

    "missed the meeting": [
        "Why did you miss the meeting?",
        "You weren't in the meeting. What happened?",
        "Where were you during the meeting?",
        "Why didn't you join the meeting?",
    ],

    "did not reply": [
        "Why didn't you reply?",
        "I messaged you earlier. Why didn't you answer?",
        "Did you see my message?",
        "Why have you not responded?",
    ],

    "did not answer the call": [
        "Why didn't you answer my call?",
        "I called you several times. What happened?",
        "Did you see my calls?",
        "Why didn't you pick up?",
    ],

    "forgot something important": [
        "How did you forget that?",
        "You were supposed to remember this. What happened?",
        "Why did you forget?",
        "Did you seriously forget about it?",
    ],

    "missed the deadline": [
        "Why did you miss the deadline?",
        "The deadline has passed. What happened?",
        "Why wasn't this completed on time?",
        "What happened with the deadline?",
    ],

    "did not finish the work": [
        "Why didn't you finish the work?",
        "Is the work done?",
        "Why is this still incomplete?",
        "What happened to the task?",
    ],

    "sent the wrong file": [
        "Why did you send the wrong file?",
        "This isn't the file I asked for. What happened?",
        "Did you check the attachment before sending it?",
        "Why is this the wrong document?",
    ],

    "forgot the homework": [
        "Where is your homework?",
        "Why didn't you do your homework?",
        "Did you forget the homework?",
        "Why haven't you submitted your homework?",
    ],

    "did not attend the class": [
        "Why weren't you in class?",
        "Where were you during class?",
        "Why did you miss class?",
        "Were you supposed to attend today?",
    ],

    "arrived late": [
        "Why did you arrive late?",
        "What took you so long?",
        "Why weren't you here on time?",
        "What happened on the way?",
    ],

    "forgot the appointment": [
        "Why didn't you come to the appointment?",
        "Did you forget your appointment?",
        "We were expecting you. What happened?",
        "Why did you miss the appointment?",
    ],

    "cancelled the plans": [
        "Why did you cancel our plans?",
        "What happened to our plans?",
        "Why did you cancel at the last minute?",
        "Are we really cancelling again?",
    ],

    "did not clean the room": [
        "Why didn't you clean the room?",
        "The room is still a mess. What happened?",
        "Were you supposed to clean this?",
        "Why is nothing cleaned?",
    ],

    "did not pay on time": [
        "Why haven't you paid yet?",
        "The payment was due earlier. What happened?",
        "Why is the payment late?",
        "Did you forget to pay?",
    ],

    "forgot the name": [
        "How did you forget my name?",
        "Do you seriously not remember my name?",
        "You forgot my name again?",
        "What is my name?",
    ],

    "did not submit the report": [
        "Where is the report?",
        "Why haven't you submitted the report?",
        "The report was due already. What happened?",
        "Did you submit the report?",
    ],

    "lost the document": [
        "Where is the document?",
        "How did you lose the document?",
        "Do you know where the document is?",
        "Why can't we find the document?",
    ],

    "did not send the email": [
        "Did you send the email?",
        "Why hasn't the email been sent?",
        "Where is the email?",
        "Why didn't you send it?",
    ],

    "did not complete the task": [
        "Why isn't the task complete?",
        "Did you finish the task?",
        "What happened with the task?",
        "Why is this still pending?",
    ],

    "did not call back": [
        "Why didn't you call me back?",
        "I was expecting your call.",
        "Did you forget to call me back?",
        "Why haven't you called?",
    ],

    "did not attend the interview": [
        "Why didn't you attend the interview?",
        "We were waiting for you. What happened?",
        "Why did you miss the interview?",
        "Were you unable to attend?",
    ],

    "missed the train": [
        "How did you miss the train?",
        "Why weren't you on the train?",
        "What happened at the station?",
        "Did you miss the train?",
    ],

    "missed the bus": [
        "How did you miss the bus?",
        "Why weren't you on the bus?",
        "What happened?",
        "Did you miss the bus again?",
    ],

    "forgot the keys": [
        "Where are the keys?",
        "Did you forget the keys?",
        "How did you leave without the keys?",
        "Why don't you have the keys?",
    ],

    "forgot the password": [
        "Why don't you know the password?",
        "Did you forget your password?",
        "How did you forget the password?",
        "Can you remember the password?",
    ],

    "did not bring the required item": [
        "Where is the thing you were supposed to bring?",
        "Did you forget the required item?",
        "Why didn't you bring it?",
        "What happened to the item?",
    ],

    "did not wake up": [
        "Why didn't you wake up?",
        "Did you sleep through the alarm?",
        "How did you not wake up?",
        "Why were you still asleep?",
    ],

    "ignored the reminder": [
        "Did you ignore the reminder?",
        "Why didn't you act on the reminder?",
        "You received a reminder. What happened?",
        "Why did you ignore the notification?",
    ],

    "was unavailable": [
        "Why were you unavailable?",
        "Where were you?",
        "Why couldn't anyone reach you?",
        "Why weren't you available?",
    ],
}


# ============================================================
# WORD BANKS
# ============================================================

REALISTIC_REASONS = [
    "There was an unexpected delay on the way.",
    "I had to deal with something urgent at home.",
    "I misunderstood the timing.",
    "I had a scheduling conflict that I handled badly.",
    "I thought I had already taken care of it.",
    "I missed the notification.",
    "I was dealing with a technical problem.",
    "I had an unexpected family matter.",
    "I wrote it down incorrectly.",
    "I genuinely thought it was scheduled for later.",
    "I had to handle an issue that came up unexpectedly.",
    "I underestimated how long the task would take.",
]


PROFESSIONAL_REASONS = [
    "I encountered an unexpected scheduling conflict.",
    "I experienced an unforeseen technical issue.",
    "There was an unexpected delay that affected my availability.",
    "I misunderstood the timing and take responsibility for the confusion.",
    "An urgent matter required my immediate attention.",
    "I underestimated the time required to complete the task.",
    "I missed the notification due to an unexpected system issue.",
    "I was unable to respond within the expected timeframe.",
]


CASUAL_REASONS = [
    "Honestly, I completely lost track of time.",
    "I thought I had more time.",
    "My brain just stopped cooperating.",
    "I got distracted for way too long.",
    "I saw it and then immediately forgot about it.",
    "I was dealing with a bunch of random stuff.",
    "I thought today was tomorrow for a second.",
    "Things got weird and I lost track of everything.",
]


SARCASTIC_REASONS = [
    "Apparently time continued moving while I wasn't paying attention.",
    "I had the rare opportunity to make a terrible decision and took it.",
    "Everything was perfectly under control, if we redefine control.",
    "I followed my usual strategy of hoping the problem would disappear.",
    "I trusted my memory. This was clearly a mistake.",
    "I decided to test whether deadlines were actually real.",
    "I was conducting an extremely unnecessary experiment.",
    "I assumed someone else would somehow know what I was thinking.",
]


IDIOTIC_REASONS = [
    "My alarm rang, so I turned it off to make sure it was working.",
    "I opened the message, forgot why I opened it, and closed it again.",
    "I put the important thing somewhere safe and immediately made it impossible to find.",
    "I thought the deadline was a suggestion.",
    "I was waiting for my brain to finish loading.",
    "I accidentally procrastinated so efficiently that I completed nothing.",
    "I checked the clock and somehow became later.",
    "I made a plan and then forgot about the existence of the plan.",
]


DARK_REASONS = [
    "I was briefly reminded that time is completely indifferent to my schedule.",
    "My motivation quietly left the building without saying goodbye.",
    "I spent too long negotiating with the consequences of my decisions.",
    "My productivity entered an unexplained period of mourning.",
    "Everything was going fine until reality became involved.",
    "I temporarily lost contact with the concept of responsibility.",
    "My plans and reality had a disagreement. Reality won.",
    "I had a minor existential crisis with terrible scheduling.",
]


ABSURD_REASONS = [
    "A pigeon created an administrative complication.",
    "The universe temporarily moved the deadline.",
    "My chair became emotionally unavailable.",
    "A suspiciously confident squirrel disrupted the schedule.",
    "I was selected for an emergency meeting by three imaginary executives.",
    "My calendar developed a personal grudge.",
    "The internet worked perfectly, which made me suspicious.",
    "A nearby toaster created an unexpected chain of events.",
]


CORPORATE_REASONS = [
    "There was an unexpected alignment issue across multiple stakeholders.",
    "The task encountered an unforeseen operational dependency.",
    "We experienced a temporary bandwidth allocation challenge.",
    "The deliverable was impacted by an execution-level synchronization gap.",
    "I encountered a cross-functional prioritization conflict.",
    "The timeline experienced a minor strategic deviation.",
    "There was a communication-flow optimization issue.",
    "The process entered an unplanned review cycle.",
]


DRAMATIC_REASONS = [
    "Everything was going perfectly until fate decided otherwise.",
    "I stood against the forces of chaos and unfortunately lost.",
    "The clock moved forward with absolutely no mercy.",
    "I tried to control the situation, but the situation had other plans.",
    "For a brief moment, the entire universe seemed personally opposed to my schedule.",
    "I believed I could overcome the problem. I was wrong.",
    "The situation escalated far beyond what any reasonable person could expect.",
    "This was not merely a delay. It was a journey.",
]


PASSIVE_AGGRESSIVE_REASONS = [
    "I assumed the information was already clear to everyone.",
    "I thought the reminder would have been sufficient.",
    "I was under the impression that someone else was handling it.",
    "I didn't realize this was suddenly my responsibility.",
    "I followed the information that was provided to me.",
    "I assumed the schedule had not changed without notice.",
    "I was working with the information available at the time.",
    "I would have handled it sooner if I had known it was urgent.",
]


# ============================================================
# FOLLOW-UP TEMPLATES
# ============================================================

FOLLOW_UPS = {
    "believable": [
        "I understand. But why didn't you let me know?",
        "That makes sense, but you should have told me.",
        "Okay. What can we do to prevent this next time?",
        "I understand. Please keep me updated next time.",
    ],

    "professional": [
        "Understood. Please ensure this does not affect the next deadline.",
        "Thank you for clarifying. Please keep me informed going forward.",
        "I understand. Let's make sure communication is clearer next time.",
        "Noted. Please provide an update as soon as possible in the future.",
    ],

    "casual": [
        "Okay, but you could've just told me.",
        "Fair enough. Just don't make it a habit.",
        "Alright, that explains it.",
        "Okay. We're good.",
    ],

    "sarcastic": [
        "Excellent. That somehow explains everything and nothing.",
        "Beautiful. I couldn't have invented a better explanation.",
        "Fantastic. Problem solved through the power of confusion.",
        "Sure. That is definitely one explanation.",
    ],

    "idiotic": [
        "That might be the worst explanation I've ever heard.",
        "I genuinely don't know whether to be impressed.",
        "You know what? I'm not even going to ask.",
        "Somehow that made things less clear.",
    ],

    "dark humor": [
        "At least the situation is still technically alive.",
        "Fine. We'll pretend this never happened.",
        "Another beautiful chapter in our ongoing disaster.",
        "Good. Let's move on before reality notices.",
    ],

    "absurd": [
        "I don't understand any of that, but continue.",
        "That explanation raised several new questions.",
        "I'm going to pretend that made sense.",
        "Fine. The squirrel wins again.",
    ],

    "corporate": [
        "Understood. Let's align on the corrective action plan.",
        "Noted. We'll revisit the workflow during the next sync.",
        "Let's ensure the same dependency does not create another delay.",
        "Please keep all stakeholders aligned moving forward.",
    ],

    "dramatic": [
        "Then let us move forward and face whatever comes next.",
        "Very well. The next chapter begins now.",
        "I accept your explanation, though history will remember this.",
        "We survive another day.",
    ],

    "passive-aggressive": [
        "Right. I'll keep that in mind next time.",
        "Okay. I suppose that explains it.",
        "Understood. I'll make a note of that.",
        "Fine. Thank you for clarifying.",
    ],
}


# ============================================================
# REASON POOL BY STYLE
# ============================================================

REASONS = {
    "believable": REALISTIC_REASONS,
    "professional": PROFESSIONAL_REASONS,
    "casual": CASUAL_REASONS,
    "sarcastic": SARCASTIC_REASONS,
    "idiotic": IDIOTIC_REASONS,
    "dark humor": DARK_REASONS,
    "absurd": ABSURD_REASONS,
    "corporate": CORPORATE_REASONS,
    "dramatic": DRAMATIC_REASONS,
    "passive-aggressive": PASSIVE_AGGRESSIVE_REASONS,
}


# ============================================================
# EXTRA MESSAGE TEMPLATES
# ============================================================

APOLOGY = {
    "believable": [
        "Sorry about that.",
        "I apologize for the delay.",
        "Sorry, I should have communicated earlier.",
    ],
    "professional": [
        "I apologize for the inconvenience.",
        "I take responsibility for the delay.",
        "My apologies for the missed communication.",
    ],
    "casual": [
        "Sorry about that.",
        "My bad.",
        "Sorry, honestly.",
    ],
    "sarcastic": [
        "My deepest apologies to the calendar.",
        "Sorry to disappoint the laws of time.",
        "My bad. Apparently consequences are real.",
    ],
    "idiotic": [
        "Sorry. My brain was on airplane mode.",
        "My apologies. I was operating without supervision.",
        "Sorry. I clearly needed a tutorial for this.",
    ],
    "dark humor": [
        "Sorry. I briefly lost the will to organize my life.",
        "My apologies. Another small victory for chaos.",
        "Sorry. Reality got involved again.",
    ],
    "absurd": [
        "Sorry. The situation was attacked by a pigeon.",
        "My apologies. The calendar became hostile.",
        "Sorry. I was negotiating with a squirrel.",
    ],
    "corporate": [
        "Apologies for the execution gap.",
        "I apologize for the temporary delivery variance.",
        "My apologies for the communication inefficiency.",
    ],
    "dramatic": [
        "Forgive me. I was defeated by the circumstances.",
        "My apologies. The day took a tragic turn.",
        "Forgive this failure in the grand timeline of events.",
    ],
    "passive-aggressive": [
        "Sorry. I assumed the situation was understood.",
        "Apologies. I worked with the information I had.",
        "Sorry. I didn't realize this had become urgent.",
    ],
}


# ============================================================
# HELPERS
# ============================================================

def choose(items):
    """Return a random item from a non-empty list."""
    return random.choice(items)


def clean_text(value: str) -> str:
    """Normalize whitespace."""
    return " ".join(str(value).split()).strip()


def make_question(situation: str) -> str:
    """Create the first message."""
    templates = QUESTION_TEMPLATES.get(
        situation,
        [
            f"What happened with {situation}?",
            f"Why didn't you handle {situation}?",
        ],
    )

    return clean_text(choose(templates))


def make_reason(style: str) -> str:
    """Choose an excuse reason."""
    return clean_text(choose(REASONS[style]))


def make_response(style: str, situation: str) -> str:
    """
    Build the main excuse response.

    The situation is included occasionally so the generated
    content is not completely generic.
    """

    reason = make_reason(style)
    apology = choose(APOLOGY[style])

    situation_phrases = {
        "late": [
            "I underestimated the time needed to get there.",
            "The delay completely threw off my timing.",
        ],
        "missed the meeting": [
            "I lost track of the meeting time.",
            "I wasn't able to join when the meeting started.",
        ],
        "did not reply": [
            "I saw the message too late.",
            "I intended to reply and then got distracted.",
        ],
        "did not answer the call": [
            "I wasn't in a position to answer at the time.",
            "I didn't notice the call immediately.",
        ],
        "missed the deadline": [
            "I underestimated the amount of time the task would require.",
            "The final part took longer than expected.",
        ],
        "did not finish the work": [
            "The task took longer than I expected.",
            "I wasn't able to finish everything within the available time.",
        ],
        "forgot the homework": [
            "I completely forgot to finish it.",
            "I intended to complete it but lost track of the deadline.",
        ],
        "did not attend the class": [
            "I lost track of the class timing.",
            "I wasn't able to attend when the class started.",
        ],
        "forgot the appointment": [
            "I completely lost track of the appointment.",
            "I had the timing wrong.",
        ],
        "did not pay on time": [
            "I missed the payment reminder.",
            "I didn't realize the payment date had arrived.",
        ],
        "forgot the name": [
            "I knew it a moment ago and then my memory abandoned me.",
            "I recognized you but somehow lost the name.",
        ],
        "did not submit the report": [
            "I thought the final submission had already gone through.",
            "I was still making the last corrections.",
        ],
        "lost the document": [
            "I saved it somewhere and can't currently remember where.",
            "I accidentally moved it and haven't located it yet.",
        ],
        "did not send the email": [
            "I drafted it but forgot to actually send it.",
            "I thought I had already pressed send.",
        ],
        "did not call back": [
            "I saw the missed call and intended to return it.",
            "I got distracted before I could call back.",
        ],
        "missed the train": [
            "I reached the station too late.",
            "I underestimated how long the trip to the station would take.",
        ],
        "missed the bus": [
            "I got to the stop just after it left.",
            "The timing went completely wrong.",
        ],
        "forgot the keys": [
            "I left without checking whether I had them.",
            "I put them somewhere and immediately forgot where.",
        ],
        "forgot the password": [
            "I haven't used it in a while.",
            "My brain rejected the password at exactly the wrong moment.",
        ],
        "did not wake up": [
            "I slept through the alarm.",
            "I heard the alarm and somehow convinced myself there was more time.",
        ],
        "ignored the reminder": [
            "I saw the reminder and thought I would handle it later.",
            "I noticed the notification but didn't act on it.",
        ],
    }

    specific = choose(
        situation_phrases.get(
            situation,
            [
                f"I was dealing with the situation involving {situation}.",
                "The situation became more complicated than expected.",
            ],
        )
    )

    # Keep responses varied.
    variants = [
        f"{reason} {specific} {apology}",
        f"{specific} {reason} {apology}",
        f"{apology} {reason} {specific}",
        f"{reason} {apology}",
    ]

    return clean_text(choose(variants))


def make_follow_up(style: str) -> str:
    """Create a response to the excuse."""
    return clean_text(choose(FOLLOW_UPS[style]))


def make_final_response(style: str) -> str:
    """Create a final excuse message."""
    final_messages = {
        "believable": [
            "Understood. I'll make sure to communicate earlier next time.",
            "You're right. I'll make sure it doesn't happen again.",
            "I'll handle it properly next time.",
        ],
        "professional": [
            "Understood. I'll take the necessary steps to prevent a repeat.",
            "Agreed. I'll improve the communication process going forward.",
            "I'll make sure the issue is addressed appropriately.",
        ],
        "casual": [
            "Yeah, fair. I'll do better next time.",
            "Got it. Won't happen again.",
            "Okay, I'll sort it out.",
        ],
        "sarcastic": [
            "Absolutely. I will now attempt to defeat the concept of time.",
            "Noted. I will schedule my next disaster more responsibly.",
            "I'll add it to my list of lessons I probably won't learn.",
        ],
        "idiotic": [
            "I'll write myself a reminder to remember the reminder.",
            "I'll try using my brain next time.",
            "I'll create a backup plan for my backup plan.",
        ],
        "dark humor": [
            "I'll try to keep the next disaster smaller.",
            "I'll attempt to make better decisions before consequences arrive.",
            "I'll survive the next deadline somehow.",
        ],
        "absurd": [
            "I'll consult the squirrel before making future decisions.",
            "I'll keep the toaster out of the planning process.",
            "I'll notify the universe before doing anything next time.",
        ],
        "corporate": [
            "I'll implement the agreed corrective action immediately.",
            "I'll ensure the relevant stakeholders remain aligned.",
            "I'll optimize the workflow accordingly.",
        ],
        "dramatic": [
            "I will rise from this failure and face tomorrow.",
            "The lesson has been learned. The journey continues.",
            "I shall return stronger, wiser, and hopefully on time.",
        ],
        "passive-aggressive": [
            "I'll keep that in mind, given the updated expectations.",
            "Understood. I'll adjust accordingly.",
            "Fine. I'll make the necessary changes.",
        ],
    }

    return clean_text(choose(final_messages[style]))


def make_timestamp(message_index: int) -> str:
    """
    Deterministic fake timestamp.

    The conversation is intentionally fictional, so there is
    no need to use the real current time.
    """

    base_minutes = 8 * 60 + 10
    minutes = base_minutes + message_index * 4

    hour = (minutes // 60) % 24
    minute = minutes % 60

    suffix = "AM" if hour < 12 else "PM"

    display_hour = hour % 12

    if display_hour == 0:
        display_hour = 12

    return f"{display_hour}:{minute:02d} {suffix}"


# ============================================================
# CONVERSATION CREATION
# ============================================================

def create_conversation(
    conversation_id: int,
    style: str,
    situation: str,
    speaker_a: str,
    speaker_b: str,
) -> dict:
    """
    Create one complete SMS-style conversation.
    """

    question = make_question(situation)
    excuse = make_response(style, situation)
    follow_up = make_follow_up(style)
    final_response = make_final_response(style)

    messages = [
        {
            "speaker": speaker_a,
            "speakerId": 0,
            "text": question,
            "time": make_timestamp(0),
        },
        {
            "speaker": speaker_b,
            "speakerId": 1,
            "text": excuse,
            "time": make_timestamp(1),
        },
        {
            "speaker": speaker_a,
            "speakerId": 0,
            "text": follow_up,
            "time": make_timestamp(2),
        },
        {
            "speaker": speaker_b,
            "speakerId": 1,
            "text": final_response,
            "time": make_timestamp(3),
        },
    ]

    return {
        "id": f"conversation-{conversation_id:05d}",
        "style": style,
        "situation": situation,
        "speakerA": speaker_a,
        "speakerB": speaker_b,
        "messages": messages,
    }


# ============================================================
# GENERATE UNIQUE CONVERSATIONS
# ============================================================

def generate_conversations(target_count: int) -> list[dict]:
    """
    Generate the requested number of conversations.

    A signature is used to reduce duplicate combinations.
    """

    conversations: list[dict] = []
    signatures: set[tuple] = set()

    attempts = 0
    max_attempts = target_count * 20

    while len(conversations) < target_count and attempts < max_attempts:
        attempts += 1

        speaker_a, speaker_b = choose(CHARACTER_PAIRS)
        situation = choose(SITUATIONS)
        style = choose(STYLES)

        signature = (
            speaker_a,
            speaker_b,
            situation,
            style,
        )

        if signature in signatures:
            continue

        signatures.add(signature)

        conversation = create_conversation(
            conversation_id=len(conversations) + 1,
            style=style,
            situation=situation,
            speaker_a=speaker_a,
            speaker_b=speaker_b,
        )

        conversations.append(conversation)

    # If the combination pool is exhausted, fill remaining
    # records using a second randomized variation.
    while len(conversations) < target_count:
        speaker_a, speaker_b = choose(CHARACTER_PAIRS)
        situation = choose(SITUATIONS)
        style = choose(STYLES)

        conversation = create_conversation(
            conversation_id=len(conversations) + 1,
            style=style,
            situation=situation,
            speaker_a=speaker_a,
            speaker_b=speaker_b,
        )

        conversations.append(conversation)

    return conversations


# ============================================================
# DATA OBJECT
# ============================================================

def build_data(conversations: list[dict]) -> dict:
    """Create the final data object."""

    return {
        "generated": True,
        "generator": "EXCUSE-AS-A-SERVICE",
        "version": "2.0.0",
        "count": len(conversations),

        "styles": [
            {
                "id": style,
                "name": style.title(),
                "description": STYLE_DESCRIPTIONS[style],
            }
            for style in STYLES
        ],

        "conversationCounts": [
            1,
            3,
            5,
            10,
            20,
            50,
        ],

        "situations": SITUATIONS,

        "characterPairs": [
            {
                "speakerA": pair[0],
                "speakerB": pair[1],
            }
            for pair in CHARACTER_PAIRS
        ],

        "conversations": conversations,
    }


# ============================================================
# JAVASCRIPT WRITER
# ============================================================

def write_javascript(data: dict) -> None:
    """
    Write valid JavaScript containing the generated data.

    The website loads this file directly in the browser.
    """

    json_data = json.dumps(
        data,
        ensure_ascii=False,
        indent=2,
    )

    javascript = (
        "/*\n"
        " * EXCUSE-AS-A-SERVICE\n"
        " * AUTO-GENERATED FILE\n"
        " *\n"
        " * DO NOT EDIT THIS FILE MANUALLY.\n"
        " * Run: python build/generate.py\n"
        " */\n\n"
        "window.EXCUSE_DATA = "
        + json_data
        + ";\n"
    )

    OUTPUT_FILE.write_text(
        javascript,
        encoding="utf-8",
    )


# ============================================================
# VALIDATION
# ============================================================

def validate_data(data: dict) -> None:
    """Perform basic validation before writing the file."""

    if not isinstance(data, dict):
        raise ValueError("Generated data is not a dictionary.")

    if "conversations" not in data:
        raise ValueError("Missing conversations.")

    conversations = data["conversations"]

    if not conversations:
        raise ValueError("No conversations were generated.")

    for index, conversation in enumerate(conversations, start=1):
        required_keys = {
            "id",
            "style",
            "situation",
            "speakerA",
            "speakerB",
            "messages",
        }

        missing = required_keys - set(conversation.keys())

        if missing:
            raise ValueError(
                f"Conversation {index} is missing: {sorted(missing)}"
            )

        messages = conversation["messages"]

        if len(messages) < 2:
            raise ValueError(
                f"Conversation {index} must contain at least 2 messages."
            )

        for message in messages:
            if "speaker" not in message:
                raise ValueError(
                    f"Conversation {index} contains a message without speaker."
                )

            if "speakerId" not in message:
                raise ValueError(
                    f"Conversation {index} contains a message without speakerId."
                )

            if "text" not in message:
                raise ValueError(
                    f"Conversation {index} contains a message without text."
                )

            if not message["text"].strip():
                raise ValueError(
                    f"Conversation {index} contains an empty message."
                )


# ============================================================
# MAIN
# ============================================================

def main() -> None:
    print("=" * 60)
    print("EXCUSE-AS-A-SERVICE CONTENT GENERATOR")
    print("=" * 60)

    print()
    print(f"Project root : {PROJECT_ROOT}")
    print(f"Output file  : {OUTPUT_FILE}")
    print(f"Target count : {TARGET_CONVERSATIONS}")
    print(f"Python       : 3.x compatible")
    print()

    print("Generating conversations...")

    conversations = generate_conversations(
        TARGET_CONVERSATIONS
    )

    print(
        f"Generated {len(conversations):,} conversations."
    )

    data = build_data(conversations)

    print("Validating generated data...")

    validate_data(data)

    print("Validation successful.")

    print("Writing JavaScript...")

    write_javascript(data)

    file_size = OUTPUT_FILE.stat().st_size

    print()
    print("=" * 60)
    print("GENERATION COMPLETE")
    print("=" * 60)
    print()
    print(f"Conversations : {len(conversations):,}")
    print(f"Styles        : {len(STYLES)}")
    print(f"Situations    : {len(SITUATIONS)}")
    print(f"Character pairs: {len(CHARACTER_PAIRS)}")
    print(f"Output        : {OUTPUT_FILE}")
    print(f"File size     : {file_size / 1024:.1f} KB")
    print()
    print("The website can now load data/content.js")
    print()


if __name__ == "__main__":
    main()
