# Voiceover Script — "How AI Converts Words into Numbers" (1:54)

Read at a relaxed, explanatory pace (~120 wpm). Timecodes match the animation.

---

**[0:00 – 0:07 · Title]**
Language models can't read words. They read numbers. So how does a word like "cat" become something a model can compute with?

**[0:07 – 0:19 · The big picture]**
Every language model has a front door. Before your text ever reaches the model itself, it passes through an *embedding layer* — and comes out the other side as numbers. That conversion is what we're about to watch, step by step.

**[0:19 – 0:27 · Typing + tokenization]**
It starts with a sentence. Before the model sees it, the text is broken into pieces called *tokens*.

**[0:27 – 0:35 · Subword split]**
Often a token is a whole word — but not always. "Quietly" becomes two pieces: "quiet" and "ly". Even the period gets its own token.

**[0:35 – 0:39 · Token IDs]**
Notice each token got a number. Where do those numbers come from?

**[0:39 – 0:46 · Vocabulary scroll]**
From the model's *vocabulary* — one big numbered list of every token it knows, fixed before training. It starts with punctuation and letters, and runs through about fifty thousand word-pieces. Scroll down to entry two-five-four-three… and there's "cat". A token's ID is simply its position in that list.

**[0:47 – 0:54 · Zoom on cat]**
Let's follow that one token: "cat" — number two-five-four-three.

**[0:54 – 1:02 · Matrix scroll]**
Inside the model sits a giant table called the *embedding matrix* — one row for every token in the vocabulary.

**[1:02 – 1:10 · Row found + extraction]**
Looking up a token couldn't be simpler: go to its row. Row two-five-four-three *is* the embedding for "cat".

**[1:10 – 1:28 · The vector]**
And that row is just a list of numbers — a *vector*. Each position holds a value, positive or negative; here, seven hundred sixty-eight of them. Where do the values come from? Nobody writes them by hand — the model learns them during training. You can loosely think of each dimension as a learned trait: how animal-like, how wild, how soft. The meaning lives in the whole pattern, not in any single number.

**[1:28 – 1:44 · Semantic space]**
Because here's the magic: these numbers are coordinates. Every word is a point in a high-dimensional space — and during training, words used in similar ways drift together. "Cat" lands near kitten, dog, and puppy… and far from car or piano. Similar meaning, nearby vectors.

**[1:44 – 1:54 · Recap]**
So that's the journey: a word… becomes a token… the token gets an ID… the ID picks a row of numbers… and those numbers place the word in meaning-space. That's a word embedding — the front door every prompt walks through.

---

*Total: ~320 words ≈ 1:52 at a calm pace.*
