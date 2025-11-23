## 1. Make “Getting Started” more Call to Action

**What it is now**

The Getting Started page mixes use cases, product overviews (ROFL, Sapphire, OPL), learning, node running, and core dev in one place.([Oasis Documentation][1]) It’s good content, but it is kinda confusing where to start now.

**What to change**

**a. Do kinda call to action cards**

Four big cards, each with a one-sentence description

1. **Build an EVM dApp with confidentiality** → Sapphire Quickstart([Oasis Documentation][2])
2. **Run off-chain logic/agents in TEEs** → ROFL Quickstart([Oasis Documentation][3])
3. **Add privacy to an existing dApp on another chain** → OPL page + its future Quickstart([Oasis Documentation][4])
4. **Run infrastructure / validators / ROFL nodes** → Run Node section (and ROFL Node docs)([Oasis Documentation][1])


## 2. Reduce friction in Quickstarts (ROFL & Sapphire)

These are great, but they’re heavy. Let’s keep the power and reduce visual/mental load.

### 2.1 ROFL Quickstart

**What it is now**

* Very clear 5-step flow: init → create → build → secrets → deploy.([Oasis Documentation][6])
* Assumes containerization, CLI installed, ~150 tokens, then dumps a full `rofl.yaml`.

**What to change**

1. **Add a “TL;DR: one-screen quickstart” section at the top**

Before the detailed sections, a small panel like:

* `oasis wallet create ...`
* get tokens from faucet
* `oasis rofl init`
* `oasis rofl create --network testnet`
* `oasis rofl build`
* `oasis rofl secret set ...`
* `oasis rofl update`
* `oasis rofl deploy`

No YAML yet, no long explanations. Just a “copy this if you’re experienced; scroll down if you need explanations.”

2. **Clarify the token story**

Current text says you need roughly 150 tokens and links to faucet + “buy ROSE” for mainnet.([Oasis Documentation][6])

* Add explicit labels:

  * **For testnet**: tokens are free → link faucet.
  * **For mainnet**: rough indication of costs + link to “Manage your Tokens” page.

3. **YAML bundle: fold into a collapsible**

The full `rofl.yaml` is important but visually overwhelming. Make it a `<details>` with a short summary above:

> “This is the default manifest we generate. Change only memory/CPU/storage unless you know what you’re doing.”

4. **Add one-liners for each command**

Right where each command is first shown, add a short explanation:

* “`oasis rofl init` → creates `rofl.yaml` describing your app’s resources and artifacts.”
* “`oasis rofl create` → registers your app on Sapphire (mainnet/testnet).”
* “`oasis rofl deploy` → boots a machine on a ROFL provider and runs your bundle.”

That avoids hunting in other docs to understand each verb.

## 3. Centralize “Networks & Tokens” mental model

**What it is now**

Pieces are spread across:

* Oasis Network conceptual doc.([Oasis Documentation][5])
* Manage your Tokens & related docs.([Oasis Documentation][5])
* Sapphire and ROFL Quickstarts (faucets, CLI wallets, etc.).([Oasis Documentation][6])

A developer has to keep track of consensus vs ParaTimes, testnet vs mainnet, and per-ParaTime RPCs.

**What to change**

Create **one** “Networks & Tokens for Builders” page and link it from:

* Getting Started
* ROFL & Sapphire Quickstarts
* OPL page where bridging is explained.

Content:

* Table of all relevant networks:

  * Oasis Consensus Mainnet/Testnet (ROSE)
  * Sapphire Mainnet/Testnet (RPC URLs, chainIds)([Oasis Documentation][2])
  * Any other supported ParaTimes.
* Relationship between:

  * ROSE on consensus layer
  * Tokens / balances on Sapphire
* “Where do I get test tokens, where do I get real ROSE?”

Then Quickstarts can say: “See Networks & Tokens for details and faucet links” instead of re-explaining.

---

## 4. Make SDK/API docs feel less like a link hub

**What it is now**

The API reference site lists language clients (Go, Python, Rust, Solidity, TypeScript) and then jumps to pkg.go.dev / npm / etc.([Oasis API][8])

That’s okay for *after* you know what you want. It’s not great for discovery.

**What to change**

For each language block (Go, Rust, TS, Solidity):

1. Add a 1–2 sentence “When to use” line. Examples:

   * “Use this Go client to talk to consensus and ParaTimes from backend services.”
   * “Use `@oasisprotocol/sapphire-ethers-v6` to integrate Sapphire into an ethers v6 dApp.”([Oasis API][8])

2. Add a 10–15 line code snippet for a trivial operation:

   * Go: get latest block height or account balance.
   * TypeScript (Sapphire): read a public variable from a deployed contract.
   * Rust: skeleton of a Wasm contract using the SDK.

3. Cross-link back into Build docs:

   * From Sapphire Quickstart, link to the TS client section on the API page.
   * From ROFL / OPL guides, link to relevant clients (e.g., TS or Rust) if they’re used there.

That way, you don’t feel “kicked out” to pkg.go.dev before seeing *anything* concrete.

---

## 5. Troubleshooting

**What it is now**

* ROFL has explicit Troubleshooting and mentions `oasis rofl machine logs`.([Oasis Documentation][6])
* Sapphire Quickstart is mostly happy-path.

**What to change**

1. Every major path should have a **“Common issues”** section:

* Symptom → “Likely cause” → “Fix” recipe.
* For Sapphire:

  * gas estimation issues
  * wrong chainId
  * Metamask vs Hardhat setup pitfalls
* For ROFL:

  * TEE / SGX / TDX not available
  * missing tokens
  * bundle build failures.

2. Provide **“Logs and debugging”** guidance:

* Where logs from ROFL apps end up, and how to avoid leaking secrets.
* How to see decrypted state in Sapphire safely (e.g., through generated getters) and what’s still confidential.([Oasis Documentation][7])

---

## 6. Small but high-impact UX/text tweaks

Finally, a grab-bag of minor changes that together reduce cognitive friction:

* **Task-oriented headings**
  Prefer “Deploy your first ROFL app” / “Use Sapphire from Hardhat” over just “Quickstart”.

* **Consistent code fences & expected output**
  Always specify language in fences (`bash`, `ts`, `solidity`) and show a short “expected output” block so devs can verify things are working.

* **Move “Last updated” higher**
  Many pages already show “Last updated on …” at the bottom.([Oasis Documentation][1])
  Surfacing that near the top helps reduce doubt about whether a guide is current.


[1]: https://docs.oasis.io/ "Getting Started | Oasis Documentation"
[2]: https://docs.oasis.io/build/sapphire/ "Sapphire ParaTime | Oasis Documentation"
[3]: https://docs.oasis.io/build/rofl/ "Runtime Off-Chain Logic (ROFL) | Oasis Documentation"
[4]: https://docs.oasis.io/build/opl/ "Oasis Privacy Layer (OPL) | Oasis Documentation"
[5]: https://docs.oasis.io/general/oasis-network/ "Oasis Network | Oasis Documentation"
[6]: https://docs.oasis.io/build/rofl/quickstart "Quickstart | Oasis Documentation"
[7]: https://docs.oasis.io/build/sapphire/quickstart "Quickstart | Oasis Documentation"
[8]: https://api.docs.oasis.io/ "The Oasis API Reference Guide"
[9]: https://docs.oasis.io/build/tools/ "Tools & Services | Oasis Documentation"
