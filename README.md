# ROYAL · ops

A bilingual logistics operations workspace prototype for Royal Dynamic Solutions.

The demo includes a shipment control tower, interactive route globe, deadline monitoring, document workflows, a communication hub, and a simulated Royal Copilot. Records and integrations are demonstration-only; the application does not connect to live carrier, terminal, email, messaging, or accounting systems.

## Run locally

From this directory, start a static server:

```sh
python -m http.server 4174 --directory dist
```

Then open [http://localhost:4174](http://localhost:4174).

The prototype uses plain HTML, CSS, and JavaScript and has no build step or package dependencies.