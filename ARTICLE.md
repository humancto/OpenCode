# How I Built a Free Alternative to CoderPad in 48 Hours (and Survived a Recursion Nightmare)

*The story of how a $599 monthly quote led me down a rabbit hole of real-time collaboration, Firebase limits, and the most terrifying bug I've ever encountered.*

---

## The $599 Wake-Up Call

Last month, I was tasked with setting up our technical interview process at my startup. Like any reasonable person, I went shopping for tools. CodePad wanted $599/month. HackerRank? $819. CodeSignal? "Contact sales" (never a good sign).

I stared at my screen in disbelief. We were a team of five. That's basically another engineer's salary just to conduct interviews. 

Then it hit me: "Wait, isn't this just a text editor with real-time sync?"

Spoiler alert: It's not. But I didn't know that yet.

## The Naive Optimism Phase

"How hard could it be?" I thought, cracking my knuckles. "Ace Editor for the code editing, Firebase for real-time sync, throw in some syntax highlighting. I'll be done by lunch."

My requirements were simple:
- Real-time collaborative editing (like Google Docs)
- Multiple programming languages
- Code execution
- Easy sharing (no account creation for candidates)
- Role-based access (interviewers vs candidates)

I gave myself a weekend. Here's what actually happened.

## Day 1: The Honeymoon Phase

### Hour 1-3: Setting Up the Basics

I started with the dream stack:
- **ACE Editor**: Because it powers Cloud9 and a dozen other IDEs
- **Firebase Realtime Database**: Google's real-time sync solution (with a generous free tier)
- **Firepad**: An open-source library that adds Google Docs-style collaboration to any text editor

The initial setup was surprisingly smooth:

```javascript
// This was literally all it took to get started
const editor = ace.edit("editor");
const firepadRef = firebase.database().ref('sessions/' + sessionId);
const firepad = Firepad.fromACE(firepadRef, editor);
```

Three lines of code and I had real-time collaboration. I was a genius!

### Hour 4-6: Adding Languages and Themes

ACE Editor supports 110+ languages out of the box. I added a dropdown, hooked up the mode switching, and boom — we had syntax highlighting for everything from JavaScript to COBOL (because why not).

```javascript
// Supporting multiple languages was surprisingly easy
const languageConfig = {
  javascript: { mode: 'ace/mode/javascript', ext: 'js' },
  python: { mode: 'ace/mode/python', ext: 'py' },
  java: { mode: 'ace/mode/java', ext: 'java' },
  // ... 13 more languages
};
```

Dark mode? Check. Multiple themes? Check. I was on fire.

### Hour 7-10: The Session System

Here's where things got interesting. I needed a way for interviewers to create sessions and share them with candidates. My first instinct was to use UUIDs:

```
Session ID: 550e8400-e29b-41d4-a716-446655440000
```

Then I imagined trying to spell that out over a phone screen. Nope.

Instead, I went with 6-digit codes like Zoom:

```javascript
function generateSessionCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
// Result: 384729 - Much better!
```

Simple, memorable, and with 900,000 possible combinations, collision-resistant enough for interview sessions.

## Day 2: The Reality Check

### The Authentication Dilemma

I woke up realizing I needed to separate interviewers from candidates. Interviewers should create sessions; candidates should only join them.

But here's the thing: I didn't want to build a whole authentication system. This was supposed to be simple! So I did something controversial:

```javascript
// Yes, client-side "authentication" - hear me out!
const ADMIN_CREDENTIALS = {
  email: 'admin@company.com',
  password: 'SomeSecurePassword'
};
```

"This is terrible security!" you might say. And you're right. But here's my reasoning:
1. This is for internal company use
2. The worst-case scenario is someone creates interview sessions
3. No sensitive data is stored
4. It can be improved later with proper auth

Sometimes, perfect is the enemy of good enough.

### Code Execution: The Plot Thickens

A code editor without execution is like a car without wheels. Sure, it looks nice, but what's the point?

I discovered the Piston API — a free service that executes code in 50+ languages. The integration was smooth:

```javascript
async function executeCode(language, code) {
  const response = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: language,
      version: '*',
      files: [{ content: code }]
    })
  });
  return response.json();
}
```

Free API with no authentication required? Christmas came early!

### The User Presence Feature

I wanted to show who's online, like Google Docs does. Firebase made this elegant:

```javascript
// Track user presence
const userRef = firebase.database().ref(`sessions/${sessionId}/users/${userId}`);
userRef.set({ name, color, timestamp: Date.now() });
userRef.onDisconnect().remove(); // Auto-cleanup when they leave
```

Each user got a random color, their name appeared in a list, and it updated in real-time. I was feeling pretty good about myself.

## The Recursion Nightmare (Hour 18-24)

This is where everything went to hell.

### The Bug That Almost Killed Everything

I was testing with a colleague. I created a session as an admin, they joined as a candidate. Suddenly, their screen exploded with notifications:

```
"Admin joined the session"
"Admin joined the session"
"Admin joined the session"
[...repeating 1000+ times]
```

Then the code in the editor started duplicating:

```javascript
function hello() {
  console.log("Hello World");
}
function hello() {
  console.log("Hello World");
}
function hello() {
  console.log("Hello World");
}
// ... repeating exponentially
```

The browser tab crashed. Then my browser crashed. Then my colleague messaged me: "Dude, my laptop is on fire."

### The Hunt for the Bug

I spent the next 6 hours in debugging hell. Here's what was happening:

1. When a candidate joined, it triggered an initialization
2. The initialization set up event listeners
3. But if the initialization ran twice (which it did), it created duplicate listeners
4. Each listener triggered more initializations
5. Exponential explosion 💥

The fix seems obvious in hindsight:

```javascript
// Before: The road to hell
function initializeSession() {
  setupFirepad();
  setupEventListeners();
  setupPresence();
}

// After: Sanity restored
let initialized = false;
function initializeSession() {
  if (initialized) return; // ONE LINE THAT SAVED EVERYTHING
  initialized = true;
  
  setupFirepad();
  setupEventListeners();
  setupPresence();
}
```

One. Single. Boolean. Flag.

I've never been so happy to see a boolean in my life.

### The Lessons from Debugging Hell

1. **Always guard against re-initialization** in real-time systems
2. **Event listeners are like rabbits** — they multiply when you're not looking
3. **Test with multiple users early** — not just in different tabs, but different browsers
4. **Add logging everywhere** — Future you will thank present you

## The Polish Phase (Hour 25-40)

With the crisis averted, I added the finishing touches:

### Visual Feedback Everything

Real-time systems feel broken without immediate feedback:

```javascript
// Connection status indicator
firebase.database().ref('.info/connected').on('value', (snap) => {
  if (snap.val()) {
    statusIndicator.textContent = '🟢 Connected';
  } else {
    statusIndicator.textContent = '🔴 Disconnected';
  }
});
```

### The Small Details That Matter

- **Auto-save indicator**: Shows when changes are synced
- **Cursor position display**: "Line 42, Column 7"
- **User count**: "3 users online"
- **Copy button feedback**: Changes to "✓ Copied!" for 2 seconds
- **Smooth animations**: Because janky UI screams "amateur hour"

### Performance Optimizations

Firebase's free tier gives you:
- 100 simultaneous connections
- 10GB bandwidth/month
- 1GB storage

To stay within limits:

```javascript
// Debounce presence updates
const updatePresence = debounce(() => {
  userRef.update({ lastSeen: Date.now() });
}, 5000);

// Cleanup old sessions
if (sessionAge > 24 * 60 * 60 * 1000) {
  sessionRef.remove();
}
```

## The "Oh Sh*t, It Actually Works" Moment

After 40 hours of coding, debugging, and questioning my life choices, I had:

- ✅ Real-time collaborative editing that actually synced smoothly
- ✅ 16 programming languages with syntax highlighting
- ✅ Code execution that worked reliably
- ✅ User presence that didn't crash browsers
- ✅ 6-digit session codes that were actually memorable
- ✅ Role-based access (admins vs candidates)
- ✅ A UI that didn't look like it was built in 1995

Total cost: $0/month.

## Deploying to Production

Firebase Hosting made deployment embarrassingly easy:

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

Five minutes later, it was live at `https://my-project.web.app`.

## The Numbers (After 1 Month in Production)

- **Interviews conducted**: 67
- **Concurrent users peak**: 12
- **Total Firebase cost**: $0.00
- **Bugs discovered by users**: 3 (all fixed)
- **Angry Slack messages about lost code**: 0
- **Money saved**: $599/month

## The Brutal Truths

Let's be honest about what this is and isn't:

### What It's NOT:
- A 100% replacement for enterprise platforms
- Suitable for 1000+ person companies
- Feature-complete compared to paid solutions
- Going to have dedicated support

### What It IS:
- Perfect for startups and small teams
- Good enough for 95% of interview scenarios
- Completely free to run
- Yours to customize and extend
- A middle finger to predatory SaaS pricing

## The Unexpected Benefits

Building this taught me more about real-time systems than any course could:

1. **Operational Transformation** is black magic (Firepad handles this, thank god)
2. **WebSocket connections** are flaky — always have reconnection logic
3. **State synchronization** is harder than distributed systems
4. **User experience** matters more than perfect code
5. **Free tiers** are more generous than you think

## Would I Do It Again?

Hell yes. But differently:

1. **Start with the hard part first** (the recursion bug would've been caught on day 1)
2. **Use TypeScript** (any sufficiently complex JavaScript project becomes a TypeScript project)
3. **Add tests earlier** (manual testing real-time features is painful)
4. **Document as I go** (I forgot how half of it worked after a week)

## The Code Is Yours

I've open-sourced everything at [github.com/humancto/OpenCode](https://github.com/humancto/OpenCode).

Clone it, deploy it, customize it, sell it — I don't care. Save your money for things that matter, like paying engineers fairly or getting good coffee for the office.

## The Real Cost Comparison

Let's talk money, because that's what started this whole journey:

```
CoderPad:  $599/month  × 12 = $7,188/year
HackerRank: $819/month  × 12 = $9,828/year
OpenCode:   $0/month    × 12 = $0/year + one stressed weekend
```

Is a weekend of your time worth $7,000+? Your call.

## Final Thoughts: The Interview Tools Cartel

The technical interview tool market is a racket. These companies charge enterprise prices for what amounts to:
- A text editor (open source)
- Real-time sync (Firebase/WebSockets)
- Code execution (Docker containers)
- Video calls (WebRTC)

None of this is rocket science. It's commodity technology wrapped in a SaaS pricing model.

Don't get me wrong — if you're Google conducting 10,lete interviews daily, pay for the enterprise solution. But if you're a startup trying to hire your first 10 engineers? Build it yourself or use open-source alternatives.

## The Call to Action

If this helped you or your team:
1. ⭐ [Star the repo](https://github.com/humancto/OpenCode) (it helps others find it)
2. Share this article with other startups
3. Contribute improvements back
4. Tweet me your success stories [@humancto](https://twitter.com/humancto)

And if you're a VC reading this: Yes, I saved my portfolio companies collectively ~$500K/year in SaaS fees. You're welcome. 😎

## P.S. - The Features I Didn't Build (Yet)

The roadmap of things I'll add when I'm bored:
- Video calling (WebRTC is free too)
- Whiteboarding (Excalidraw is open source)
- Question bank (Markdown files in a folder)
- AI evaluation (GPT API for code review)
- Recording & playback (MediaRecorder API)

Each of these is a weekend project. The entire interview tool industry is a house of cards built on free, open-source technology.

Go build something. Break the cartel.

---

*Found this useful? I write about building startup tools on a shoestring budget. Follow me for more adventures in frugal engineering.*

*Got questions? Open an issue on GitHub or find me on Twitter [@humancto](https://twitter.com/humancto)*