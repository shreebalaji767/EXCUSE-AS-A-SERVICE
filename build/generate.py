import random
import json
import hashlib
from pathlib import Path

random.seed()

OUT = Path(__file__).resolve().parent.parent / "data"
OUT.mkdir(exist_ok=True)

characters = [
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

situations = [
    "being late",
    "not replying to a message",
    "missing a meeting",
    "forgetting something important",
    "not finishing the work",
    "forgetting a birthday",
    "canceling plans",
    "arriving without preparation",
    "not answering a phone call",
    "losing an important file",
    "forgetting homework",
    "missing an appointment",
    "not cleaning the room",
    "spending too much money",
    "forgetting someone's name",
    "not attending an event",
    "being awake at an unreasonable hour",
    "not calling back",
    "ignoring a notification",
    "missing a deadline",
    "sending the wrong file",
    "breaking something",
    "forgetting to bring something",
    "not studying",
    "leaving something until the last minute",
    "changing plans",
    "arriving at the wrong place",
    "taking too long to respond",
    "not doing the obvious thing",
    "making an unnecessarily complicated decision",
]

styles = [
    "believable",
    "professional",
    "casual",
    "sarcastic",
    "idiotic",
    "dark",
    "absurd",
    "corporate",
    "dramatic",
    "passive-aggressive",
]

openings = [
    "Why didn't you do it?",
    "What happened?",
    "Where were you?",
    "Why weren't you there?",
    "Why didn't you answer?",
    "Why are you late?",
    "Why isn't this finished?",
    "Did you forget?",
    "Can you explain this?",
    "What exactly happened?",
    "Why didn't you tell me?",
    "Where is it?",
    "Why did you disappear?",
    "Why haven't you done this yet?",
]

believable_replies = [
    "I had an unexpected delay and it took longer than I expected.",
    "Something came up at the last minute and disrupted my plans.",
    "I underestimated how much time I would need.",
    "I thought I had more time than I actually did.",
    "I was dealing with an issue that took longer to resolve.",
    "I intended to handle it earlier, but the timing got away from me.",
    "I had a scheduling problem and didn't manage it properly.",
]

professional_replies = [
    "There was an unforeseen scheduling issue that affected my availability.",
    "An unexpected logistical issue disrupted the original timeline.",
    "I underestimated the time required and that affected the delivery.",
    "A last-minute issue caused an unavoidable delay.",
    "The situation required more attention than originally anticipated.",
]

casual_replies = [
    "Honestly, things just got away from me.",
    "I completely lost track of time.",
    "I thought I had it under control. I clearly didn't.",
    "It somehow became much more complicated than it needed to be.",
    "I meant to do it earlier. Then the day happened.",
]

sarcastic_replies = [
    "I was following a highly sophisticated plan known as 'figure it out later.'",
    "Everything was going perfectly until reality became involved.",
    "I had a plan. Reality submitted a counterproposal.",
    "I successfully postponed the problem until it became a bigger problem.",
    "I would explain, but the explanation is currently under review.",
]

idiotic_replies = [
    "My brain temporarily switched to airplane mode.",
    "I was ready, but apparently my sense of time wasn't.",
    "I had a very important meeting with absolutely nothing.",
    "My organizational system became disorganized.",
    "I was waiting for my motivation to load.",
    "The situation exceeded my available brain bandwidth.",
]

dark_replies = [
    "I had every intention of handling it. Unfortunately, intention remains undefeated and execution remains missing.",
    "I thought I had more time. Time disagreed.",
    "I was trying to keep everything together. The schedule had other plans.",
    "Nothing dramatic happened. That's probably what made it worse.",
    "I postponed one small problem until it became an excellent example of poor decision-making.",
]

absurd_replies = [
    "There was an unexpected disagreement between me and the laws of time.",
    "A completely unrelated sequence of events somehow became my problem.",
    "I briefly entered a parallel universe where this had already been completed.",
    "A suspiciously determined chicken interfered with the original plan.",
    "The universe provided insufficient documentation for what happened next.",
    "I was temporarily unavailable due to circumstances that sound fake even when I explain them.",
]

corporate_replies = [
    "We encountered an unforeseen alignment issue affecting the current deliverable.",
    "The situation required a temporary strategic realignment.",
    "There was a minor operational disruption within the broader workflow.",
    "The original timeline experienced an unexpected optimization challenge.",
]

dramatic_replies = [
    "I tried. Fate objected.",
    "I stood at the edge of responsibility and made a questionable decision.",
    "Everything was under control until it very suddenly wasn't.",
    "This began as a minor problem and evolved into a full administrative tragedy.",
]

passive_replies = [
    "I assumed it was already understood.",
    "I thought someone else had handled it.",
    "I didn't realize this required immediate attention.",
    "I was under the impression that there was still time.",
]

followups = [
    "And you didn't think to tell me?",
    "That sounds convenient.",
    "How exactly did that happen?",
    "So what happened next?",
    "And now?",
    "That's your explanation?",
    "You had all day.",
    "I don't even know what to say to that.",
    "Right. Of course.",
    "I suppose that explains something.",
]

endings = [
    "I'll make sure it doesn't happen again.",
    "Anyway, that's the official version.",
    "I accept that this sounds considerably worse when spoken aloud.",
    "I'm aware that this explanation has weaknesses.",
    "At this point, all I can offer is an apology.",
    "I would provide more details, but they would probably make it worse.",
    "Let's agree that tomorrow will be more organized.",
    "This seemed more reasonable five minutes ago.",
]

reply_map = {
    "believable": believable_replies,
    "professional": professional_replies,
    "casual": casual_replies,
    "sarcastic": sarcastic_replies,
    "idiotic": idiotic_replies,
    "dark": dark_replies,
    "absurd": absurd_replies,
    "corporate": corporate_replies,
    "dramatic": dramatic_replies,
    "passive-aggressive": passive_replies,
}

def fingerprint(lines):
    text = "|".join(
        f"{x['speaker']}:{x['text']}".lower().strip()
        for x in lines
    )
    return hashlib.sha256(text.encode()).hexdigest()

def make_conversation(i):
    a, b = random.choice(characters)
    situation = random.choice(situations)
    style = random.choice(styles)

    q = random.choice(openings)
    reply = random.choice(reply_map[style])
    follow = random.choice(followups)
    ending = random.choice(endings)

    # Small contextual additions.
    if random.random() < 0.45:
        reply = reply + " " + random.choice([
            "It was related to " + situation + ".",
            "That was the basic problem.",
            "That's where everything went wrong.",
            "It became more complicated from there.",
        ])

    lines = [
        {"speaker": a, "text": q},
        {"speaker": b, "text": reply},
        {"speaker": a, "text": follow},
        {"speaker": b, "text": ending},
    ]

    return {
        "id": i,
        "style": style,
        "situation": situation,
        "title": random.choice([
            "An Explanation",
            "The Official Version",
            "A Completely Reasonable Conversation",
            "Questions Were Asked",
            "This Could Have Gone Better",
            "The Investigation",
            "A Minor Administrative Disaster",
            "Nobody Was Prepared",
        ]),
        "lines": lines,
    }

TARGET = 50000

conversations = []
seen = set()

attempts = 0

while len(conversations) < TARGET and attempts < TARGET * 20:
    attempts += 1
    item = make_conversation(len(conversations) + 1)
    fp = fingerprint(item["lines"])

    if fp in seen:
        continue

    seen.add(fp)
    item["fingerprint"] = fp
    conversations.append(item)

print(f"Generated {len(conversations):,} unique conversations.")

# Excuse templates for the ASK ANYTHING engine.
excuse_templates = {
    "believable": [
        "I had an unexpected issue that took longer than anticipated.",
        "Something came up at the last minute and disrupted my plans.",
        "I underestimated how much time I would need.",
        "I thought I had everything under control, but the timing changed.",
    ],
    "sarcastic": [
        "I had a plan. Unfortunately, reality had a different one.",
        "Everything was under control until I became involved.",
        "I was following a highly advanced strategy known as 'deal with it later.'",
    ],
    "idiotic": [
        "My brain temporarily stopped accepting new information.",
        "I was waiting for my common sense to finish loading.",
        "The situation exceeded my available brain bandwidth.",
    ],
    "dark": [
        "I intended to deal with it before it became a problem. That strategy aged badly.",
        "I had every intention of being responsible. Intention was apparently enough for the day.",
        "It started as a small problem and developed into a useful lesson in poor planning.",
    ],
    "absurd": [
        "There was an unexpected disagreement between me and the laws of reality.",
        "I briefly entered a parallel universe where this had already been handled.",
        "The universe supplied absolutely no useful documentation for what happened next.",
    ],
}

payload = {
    "generatedAtBuild": True,
    "count": len(conversations),
    "conversations": conversations,
    "excuseTemplates": excuse_templates,
}

target = OUT / "content.js"

target.write_text(
    "window.EXCUSE_DATA = " +
    json.dumps(payload, ensure_ascii=False, separators=(",", ":")) +
    ";",
    encoding="utf-8"
)

print("Written:", target)
