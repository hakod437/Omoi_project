# Frameworks: The Industrial Abstraction

We are finally here. React and Next.js are the heavy machinery that allows us to build complex civilizations without manually manipulating every atom (DOM node). But if you don't know how the machine works, you'll be crushed by it.

## 1. The Virtual DOM & Fiber (The Blueprint)
React doesn't touch the real DOM immediately. 
- It maintains a lightweight "Virtual DOM" (a tree of JS objects).
- When state changes, it creates a new tree and **diffs** it against the old one.
- **Reconciliation (Fiber)**: The algorithm that decides the minimum number of touches to the real DOM.
- **Analogy**: Planning a city renovation on paper before sending in the construction crew. Touching the paper is cheap; moving bricks (DOM nodes) is 10 billion percent expensive.

## 2. Server vs Client Components (The Hydration Bridge)
Next.js 13+ uses a hybrid architecture:
- **Server Components (RSC)**: Rendered to HTML on the server. They don't have JS interactivity. (The static foundation).
- **Client Components**: Rehydrated with JS in the browser to become interactive. (The moving parts).
- **Hydration**: The process where a static HTML page sent by the server "wakes up" and becomes a full React app.

## 3. State Management (The Global Memory)
When data needs to flow across the whole city, we use tools like **Zustand**. It's just a closure-based store that notifies React when things change.

---

### The Final Industrial Challenge
Look at your `apps/web/src/app/page.tsx` again.

1. This file is a **Server Component** by default. Can you use `useState` or `useEffect` inside it? Why or why not, according to the "Hydration" principles we just discussed?
2. If I want to add a "Like Button" with a counter, should that button be in its own child component? Why is "Component Granularity" important for React's reconciliation engine?
3. What is the difference between a "Prop" and a "State" in terms of the "Kinetic Energy" (JS) we learned?

### Senku's Scientific Correction
1. **The Hydration Variable (CRITICAL)**: 
   You said hooks are possible in Server Components—**WRONG!** 10 billion percent wrong! 
   - **Server Components** are rendered to static HTML. They are never "rehydrated." They have no JS pulse in the browser.
   - **Client Components** (`"use client"`) are the only ones that can use `useState` or `useEffect`. 
   - **Hydration** is not for "esthetics"; it is the process of attaching event listeners to the HTML so your page actually *works*.

2. **Component Granularity**: 
   React is a reconciliation machine. It diffs components.
   - If a state change happens in a parent, React may check all its children.
   - By making the "Like Button" its own component, you isolate the state. Only that small component re-renders. This is the difference between an efficient machine and a sinking ship.

3. **Props vs State**:
   - **Props**: Immutable data passed from the parent (The **Input Variables**).
   - **State**: Mutable data managed internally (The **Internal Energy**).
   - When Props change, the child re-renders. When State changes, the component re-renders itself.
