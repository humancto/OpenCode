# How I Vibecoded a Real-Time Collaborative Tool and Open Sourced It

*5 hours, 3 Red Bulls, and one recursive nightmare that almost melted my MacBook*

---

## The Vibe Check

Look, I'm not gonna lie — I basically YOLO'd this entire project. My startup needed a coding interview tool. CoderPad wanted $599/month. I had a free Sunday afternoon and an unhealthy amount of confidence.

"Real-time collaboration? That's just WebSockets with extra steps," I told myself, already three YouTube tutorials deep into Firebase documentation.

Reader, it was not just WebSockets with extra steps.

## Hour 1: Copy-Paste Engineering

I'm not above admitting that my first hour was pure Stack Overflow archaeology. 

```javascript
// Found this on some blog from 2019
const editor = ace.edit("firepad-container");
const firepad = Firepad.fromACE(firebaseRef, editor);
```

Wait, that's it? Two lines and I have Google Docs-style collaboration? 

*Chef's kiss* to whoever built Firepad. You're the real MVP.

ACE Editor? Already built. Firebase? Already exists. Firepad? Does the hard math stuff I don't understand. I was basically assembling IKEA furniture at this point — if IKEA furniture could sync across browsers in real-time.

## Hour 2: The "How Hard Could It Be?" Phase

Added 16 programming languages because the dropdown looked sad with just JavaScript:

```javascript
// I literally just kept adding languages until the dropdown scrolled
javascript, python, java, c_cpp, csharp, php, ruby, go, 
rust, typescript, swift, kotlin, html, css, sql, markdown
```

Threw in some themes because dark mode is non-negotiable in 2024. Added syntax highlighting because we're not barbarians.

Session codes? Started with UUIDs, then realized nobody wants to spell out `f47ac10b-58cc-4372-a567-0e02b2c3d479` over Zoom. Switched to 6-digit codes like a normal person:

```javascript
Math.floor(100000 + Math.random() * 900000)  // Revolutionary stuff here
```

## Hour 3: The Recursion Incident™️

This is where things went from "I'm a genius" to "I'm about to burn my laptop for the insurance money."

Connected as admin: ✅  
Friend joins as candidate: ✅  
Their editor starts duplicating content: ❌❌❌

```javascript
// What their screen showed:
Hello World
Hello World
Hello World
Hello World
[... x1000]
```

Then the browser froze. Then my browser froze. Then my friend texted: "BRO YOUR APP IS TRYING TO KILL MY MACBOOK"

The bug? I was initializing Firepad every time someone breathed near the keyboard. Event listeners were multiplying like rabbits. The fix?

```javascript
let initialized = false;  // This boolean saved my life
if (initialized) return;
initialized = true;
```

One. Boolean. Flag.

I've written distributed systems that were less complicated than preventing this recursive hellscape.

## Hour 4: Making It Not Look Like Trash

Real talk: The first version looked like a GeoCities page. So I did what any self-respecting developer does — I found a nice color palette and abused CSS until things looked intentional:

```css
/* The "I know what I'm doing" starter pack */
border-radius: 8px;
box-shadow: 0 2px 8px rgba(0,0,0,0.1);
transition: all 0.3s ease;
```

Added user presence indicators because seeing "2 users online" makes it feel legit. Color-coded users because rainbow arrays make everything better.

Quick notification system for joins/leaves:
```javascript
showNotification(`${user.name} joined the session`, 'join');
// It's literally just a div that appears and disappears
```

## Hour 5: Ship It and Pray

Firebase deployment is stupid easy:

```bash
firebase init
firebase deploy
# Done. Literally done.
```

Added code execution using some free API I found (Piston). They run arbitrary code from strangers on the internet for free. God bless these chaotic heroes.

Final touch: Made sharing dead simple. Click button → copy session code → paste to candidate. No sign-ups, no OAuth dance, no BS.

## The Brutal Honesty Section

**What this is:**
- A tool that works 95% of the time
- Free to run forever
- Good enough for startup interviews
- Customizable if you speak JavaScript

**What this isn't:**
- Enterprise-grade anything
- Guaranteed to not explode
- Supported by anyone but yourself
- Pretty code (seriously, don't look too close)

## The Vibe-conomics

Let me break down the financial vibe check:

```
What they wanted: $599/month
What I paid: $0/month
Time invested: 5 hours
Energy drinks consumed: 3 ($12)
Net savings: $587/month
Ego boost: Priceless
```

ROI after literally one month: 4,891%

That's not engineering. That's printing money.

## The Open Source Flex

Here's the thing — I could've kept this private, maybe even charged for it. But you know what's cooler than making money? Costing VCs millions in portfolio company savings.

It's all on GitHub: [github.com/humancto/OpenCode](https://github.com/humancto/OpenCode)

Clone it. Fork it. Sell it as a service. I don't care. The code is MIT licensed, which basically means "do whatever, just don't sue me when it breaks."

## The Features I Didn't Build Because Sunday Was Ending

- **Video calling**: WebRTC is free but my patience wasn't
- **Whiteboarding**: Exists but requires actual effort
- **AI evaluation**: GPT-4 costs money and I'm cheap
- **User accounts**: localStorage gang rise up
- **Tests**: YOLO in production baby
- **Documentation**: You're reading it

## Real Usage Stats After a Month

- **Interviews run**: 67
- **Times it crashed**: 2 (both my fault)
- **Firebase bill**: $0.00
- **Angry messages from candidates**: 0
- **Money saved**: ~$600
- **Satisfaction**: 420/69

## The Philosophical Take Nobody Asked For

The entire SaaS industry is built on charging $599/month for free technologies wrapped in divs. These interview platforms are charging enterprise prices for:

- **Text editor**: Open source (FREE)
- **Real-time sync**: Firebase (FREE tier)
- **Code execution**: Docker containers (basically FREE)
- **Hosting**: Also FREE

You're not paying for technology. You're paying for someone else's weekend project that they turned into a Delaware C-Corp.

## The Unhinged Conclusion

I built this in 5 hours fueled by spite and caffeine. It's not perfect. It occasionally hiccups. The code would make senior engineers cry.

But it works. It's free. And it proved that half the SaaS tools out there are just charging you for the privilege of not spending a Sunday afternoon on YouTube tutorials.

## The Call to Chaos

If you use this:
- ⭐ Star the repo (GitHub stars are my cryptocurrency)
- Break it and tell me how
- Add features and PR them
- Build your own SaaS on top and charge $299/month (undercut the market)
- Tweet about it so VCs know their portfolio companies are bleeding money

## Final Vibe

The best code is code that exists and solves a problem. This exists. It solved my problem. It might solve yours.

Or it might crash spectacularly during your most important interview. 

Either way, you saved $599.

Peace out ✌️

---

*I vibe-code tools that probably shouldn't exist but do anyway. This is one of them.*

*Found a bug? That's a feature. But open an issue anyway: [github.com/humancto/OpenCode](https://github.com/humancto/OpenCode)*

*Not responsible for: crashed browsers, failed interviews, existential crises about SaaS pricing, or the realization that everything is held together with JavaScript and prayer.*