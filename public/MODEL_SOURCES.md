# AUTO ATLAS — model sources and fidelity

Research and integration date: 2026-09-13.

## Imported asset

- Title: 2024 Hyundai Elantra N
- Creator: Ddiaz Design
- Original: https://sketchfab.com/3d-models/2024-hyundai-elantra-n-4ba1b1b0eb844e318cc708ada1f2f51f
- Creator states: based on a CSR2 3D model; credits ACMP Discord Server.
- Public download page: https://downloadfree3d.com/3d-models/vehicles/car/2024-hyundai-elantra-n/
- Downloaded archive member: `source/2024 HYUNDAI ELANTRA N.glb`
- Local file: `models/elantra-n.glb`
- SHA-256: `bc77f463b5407c28792b46d4bd7700fbe0836ed8f10507edcc602b560f7400bf`
- Asset metadata identifies Ddiaz Design and the original Sketchfab URL above. The mirror's visible credit differs; embedded asset provenance matches the original creator page.
- The current creator page specifies **CC Attribution-NonCommercial**. The downloaded file's older metadata says CC-BY-4.0. This project follows the more restrictive **CC BY-NC 4.0**, with attribution and modification disclosure. No commercial rights or manufacturer endorsement are asserted.
- License: https://creativecommons.org/licenses/by-nc/4.0/

## Geometry audit

The GLB contains 35 meshes, 88 nodes, 26 materials, and 258,192 source triangles. All triangles are preserved after grouping. A mesh/connected surface fragment is not necessarily an actual manufactured part. The application exposes 34 visual assembly groups; these are not 34 OEM part numbers.

The full source asset is stored locally. The browser does not fetch the model from an external service or require a Sketchfab login at runtime.

## Changes made

- Normalize source world transforms and orientation: source +Z forward becomes application +X forward; Y remains up.
- Bake transforms and preserve source UVs and other vertex attributes.
- Split by indexed connectivity, preserving triangle boundaries. Bucket fragments into visual assemblies using source names and positions.
- Apply approximate front/rear, left/right and interior/exterior labels. Some trim remains attached to neighboring source groups.
- Extract brake-disc surfaces from wheel meshes using spatial bounds; combine with the original caliper geometry.
- Add view-only exploded translations and approximate hood/door/trunk hinges; these are not verified mechanical assembly paths.
- Adjust paint tint, glass transparency, environment lighting and selection emphasis. These are presentation changes, not OEM material measurements.
- Add clipping, wireframe, selection, visibility, search, camera fitting and PNG export with attribution.

## What is actually present

- Vehicle-specific exterior panels and surface details.
- Interior surfaces: seats, steering wheel, dashboard, console, trim and glass.
- Engine-bay surface detail: upper cover, visible hoses/connectors, tanks and supporting surfaces.
- Wheel/tire geometry, tread detail, calipers and rotor surfaces.
- Rear exhaust outlets and partial underbody surfaces.

## What is not present in the imported vehicle or not verified

- OEM dimensioned CAD, manufacturing tolerances, fastener BOM and certified part numbers.
- Complete cylinder block interior, pistons, connecting rods and crankshaft.
- Complete transmission internals, full suspension/steering assemblies, full body-in-white reinforcements.
- Complete fuel, cooling, exhaust, electrical, HVAC and restraint systems.
- Watertight mechanical cross-sections. Clipping reveals only surfaces already in the source; it does not generate missing internals.
- Engineering correctness of the source. It is a visualization/game-derived model, not an OEM engineering asset.

The imported vehicle geometry remains unchanged. Separately authored mechanical reference scenes are available through the detailed exploration links; they are not represented as internals extracted from this vehicle.

## Official vehicle references

- Hyundai Motor America, 2024 Elantra N launch/model information: https://www.hyundainews.com/models/hyundai-elantra-2024-elantra_n
  Confirms the 2.0T gasoline powertrain, front-wheel drive, six-speed manual/eight-speed DCT availability and design changes. The viewer does not claim the asset matches a specific transmission configuration.
- Hyundai N model information: https://www.hyundai-n.com/en/models/n/elantra-n
  Powertrain and chassis reference; some current-page content may refer to a later revision than the 2024 visualization asset.

## Other sources investigated, not incorporated

- GMU CCSA public vehicle FEM library: https://www.ccsa.gmu.edu/models/
  Engineering crash models for other vehicle makes were available, but were not substituted for Hyundai components.
- NHTSA full vehicle models: https://www.nhtsa.gov/crash-simulation-vehicle-models
  Honda Accord and seat research models do not supply the requested Hyundai assemblies.
- Illumaesthetic CN7 3D scan data: https://www.illumaesthetic.com/collections/scan-data/products/hyundai-elantra-n-cn7-3d-scan-2020
  Paid exterior scan offerings; no purchase was made, and these do not establish full internal assembly coverage.
- 3DModels Elantra N: https://3dmodels.org/3d-models/hyundai-elantra-n-us-spec-2022/
  Commercial visualization/CAD-format options; no purchase or accuracy claim was made.
- Hyundai-specific engine CAD searches did not produce an openly downloadable and verified complete Theta II/Elantra N engine assembly during this investigation.

## Reproducibility and validation

`scripts/inspect-model.mjs` audits the local GLB; its output is a geometry connectivity report, not an OEM parts inventory. `scripts/inspect-unwelded.mjs` records indexed fragments used as a segmentation reference.

`node artifacts/check.mjs` checks loading, exact source triangle conservation, all assembly visibility, explosion, openings, presets, filters, clipping, wireframe, reset, image export, source disclosure, and mobile layout in Chrome. Results are recorded in `artifacts/validation.json`.

## Mechanical reference explorer — added 2026-09-13

`/mechanics.html?system=engine` and `?system=suspension` contain newly authored procedural geometry, not downloaded OEM CAD. No Hyundai part numbers or exact fitment is claimed. The existing 258,192-triangle car asset remains separate and intact.

- Engine: 80 selectable groups. Four pistons, 12 individual rings, four wrist pins, four connecting rods and four caps, crankshaft, five main bearing shells, two camshafts, 16 individual valves and 16 spring/retainer groups, four plugs, block, head, gasket, cover, sump, oil pickup, flywheel and timing chain.
- Front suspension: 29 selectable groups. Mount, thrust bearing, seats, isolator, spring, dust boot, bump stop, damper outer/working tubes, rod, guide/seal, piston/base valves, knuckle, wheel bearing, hub, ventilated rotor, caliper, pads, caliper pistons, lower arm and bushings, ball joint, tie rod, end link, and a drive shaft/CV reference.
- Geometry uses bored extrusions, lathed profiles, hollow sleeves, coils, rings, individual rolling elements, disc ventilation vanes and fastener details. Some named assemblies retain several submeshes (e.g. spring/retainer, hub/studs). Counts are exploration groups, not a complete service BOM.
- Component selection, category tree/search, per-part visibility, isolation, same-system view, assembled/exploded slider, housing transparency, internal-only preset, labels, wireframe, camera views and attributed PNG export.
- Engine valve axes and cam lobes are illustrative; complete combustion chambers, valve timing, oil/coolant galleries, turbocharging, injection and all fasteners are not reproduced. The original exploded geometry view is static. A subsequent engine learning mode adds the idealized kinematics described below; it is not an operating-load simulation.
- Suspension uses a generic MacPherson relationship and twin-tube damper explanation, not Hyundai ECS valving, actual suspension geometry, kinematics or loading. Rear suspension is not included. Exploded positions are for viewing, not a service sequence.

Primary references for component names and functions (no source mesh copied):
- Motorservice, Products in the engine: https://www.ms-motorservice.com/int/en/products/products-in-the-engine
- KYB, Strut mounts and boots: https://www.kyb.com/products/strut-mounts-and-boots/
- NTN-SNR, suspension technical brochure: https://www.ntn-snr.com/sites/default/files/2017-03/suspension_en.pdf (indexed during research; direct PDF retrieval was intermittent).

Additional CAD investigated: CadCrowd 4 Cylinder Engine Assembly and Coil Spring Damper Suspension. Public download links require account login; no files were obtained or incorporated, and no login restriction was bypassed.

Browser validation also records `artifacts/mechanics-validation.json` and mechanical scene screenshots, including return navigation to the original vehicle.

## Engine-room parent assembly — added 2026-09-13

`/mechanics.html?system=bay` is a parent scene for the engine-room systems. `src/engine-bay.js` authors the peripheral geometry and embeds the existing 80-group engine model as one selectable `engine-assembly`. Its detail button opens the unchanged engine explorer. Strut-tower entries similarly open the 29-group suspension explorer. Returning through the breadcrumb restores selected part, explosion, visibility, filters and camera for that scene.

The parent scene has 85 selectable groups (including the single engine assembly) and covers nine categories: engine/mounts, intake/boost, exhaust/turbo, cooling/lubrication, fuel/ignition, electrical/control, auxiliaries, transmission/drive, and supporting body reference. Filter elements/covers, turbo rotating assembly/housings, cooling heat exchangers, individual injectors/coils, representative pipes and sensors are independently selectable.

References consulted:
- Hyundai, 2024 Elantra N: https://www.hyundainews.com/models/hyundai-elantra-2024-elantra_n — vehicle powertrain context, not dimensioned engine-room CAD.
- Bosch, Gasoline direct injection: https://www.bosch-mobility.com/en/solutions/powertrain/gasoline/gasoline-direct-injection/ — fuel supply, high-pressure pump, rail, injection, air management, ignition and control relationships. No Bosch fitment or pressure rating is asserted for this visualization.
- Garrett, How a turbo works: https://www.garrettmotion.com/ko/turbocharger-technology/how-a-turbo-works/basic/ — turbine/compressor and charge-air-cooling relationships. No Garrett component fitment is asserted.

All peripheral meshes, hose routes, mounting coordinates and body references are newly authored approximations. Exact CN7 component packaging and routing were not verified from OEM service CAD. This scene is not a complete OEM BOM: bolts, clips, seals, full wiring, precise sensor counts, cabin systems, fuel tank and transmission internals are outside coverage. The transmission exterior is generic rather than a claim of a particular 6MT or 8DCT configuration. Fan arrangement, vacuum system and accessory belt routing are explanatory. Captures and the interface disclose this scope.

`artifacts/engine-bay-validation.json` records coverage, nested engine geometry, search/family filters, engine and suspension drill-down, return-state restoration and mobile verification. Existing car triangle-conservation tests remain in the same browser check.

## Engine learning and cyclic kinematics — added 2026-09-13

The engine now opens in a paused learning view. Five lessons cover the four strokes, slider-crank conversion, valve timing, sealing/lubrication, and the path from crankshaft to tires. All 80 engine groups have purpose, cooperating components, qualitative failure consequences and navigable related-part references. Multiple-choice checks supply explanatory feedback. The downstream clutch/transmission/differential/tire path is textual, not a newly simulated drivetrain.

Motion model (`src/engine-motion.js`):
- Slider-crank constraints use crank radius 0.22 and rod length 0.78 in arbitrary visualization units. The wrist pin remains on the cylinder axis while the big end follows the rotating crankpin. Piston, wrist pin and rings translate together; rod and cap rotate together.
- Four cylinders use illustrative phase offsets [0, 180, 540, 360] crank degrees, corresponding to a 1–3–4–2 firing sequence. This is a teaching choice, not a claim of verified Hyundai ECU timing.
- One cycle is 720 crank degrees. Both camshafts rotate at half crank speed. Valves use idealized smooth lift during the corresponding 180-degree stroke, with no valve overlap or variable timing. Springs compress against a fixed lower seat; retainers move with valve lift.
- The chain indicator circulates along an approximate route. Lobes are phase-oriented illustrations; follower/tappet contact, exact lobe profiles, chain dynamics and valve-clearance calculations are not simulated.
- Chamber color, flow arrows and spark markers explain phase; they do not represent measured pressure, chemistry, gas color, CFD or flame propagation. GDI fuel injection hardware is in the parent engine-room view, and injection timing is not animated here. Teaching ignition is at approximately compression TDC; real ignition advance is omitted.
- Replay speed 1× means eight seconds per four-stroke cycle. It is intentionally slow and is not an actual engine RPM setting. Replay stops advancing when the document is hidden.
- Pause, 0–720° scrubbing, per-stroke selection, next-stroke, playback speed, one-cylinder focus and all-four-cylinder views are available. Switching back to structure restores the static inspection state.

Primary explanatory references:
- U.S. Department of Energy, Internal Combustion Engine Basics: https://www.energy.gov/cmei/vehicles/articles/internal-combustion-engine-basics — combustion energy, piston/crank conversion, four strokes and the link to wheels. Its general gasoline description is not used to imply port injection for the GDI reference model.
- EPI Engineering, Camshaft and Valvetrain Basics: https://epi-eng.com/piston_engine_technology/camshaft_basics.htm — cam/follower relationship and camshaft half-speed in a four-stroke engine.
- Motorservice engine product groups (listed above) — component function and terminology.

`artifacts/engine-learning-validation.json` records browser checks of actual transformed rod endpoints, constant rod length, crank/cam rotation ratio over eleven crank positions, synchronized valve states, four-cylinder phase distribution, play/pause/scrub, lesson questions, related-part navigation and mobile layout. These checks validate the educational implementation, not OEM engineering accuracy.

## Peripheral learning and drivetrain reference — added 2026-09-13

Coverage is the 85 existing engine-room groups, 29 front-suspension groups, and 35 newly authored drivetrain/steering groups, in addition to the existing 80 engine groups. All these groups now have purpose, cooperation, qualitative functional-loss consequences, related links and applicable lesson entry points. The 34 imported full-car surface groups also have role descriptions and links; their source geometry remains unchanged.

There are 23 lessons in total: engine 5, engine-room 9, suspension 4, drivetrain/steering 5. Learning supports pause/play, slow replay speed, phase scrub, step selection and explanatory multiple-choice feedback. Stationary support parts are taught through connections, rather than fictitious motion.

New geometry (`src/drivetrain-model.js`) includes a generic single-plate friction clutch, pressure plate, diaphragm spring, release bearing, shafts/bearings, a 20:40 external gear pair, generic differential case/side/spider gears, half shafts/CV references, wheels/tires and rack/pinion/tie-rod steering. The assemblies are arranged by function for visibility, not a verified transaxle packaging reconstruction. It does not represent the Hyundai 8DCT, complete 6MT gear selection, e-LSD, all synchronizers or measured tooth profiles.

Kinematics and indicators (`src/system-motion.js`):
- Turbo shaft and its wheels rotate together. Fixed housings remain fixed. Fan blade groups and accessory pulley parts rotate; selected components retain the red selection color.
- Flow streams connect functional nodes. The two turbo gas paths remain separate. Cooling, oil, fuel, A/C and electrical indicators are distinct lesson overlays, not actual routing, current, CFD, pressures or particle velocities. Missing in-engine/cabin/tank segments are explicitly described as out of scope.
- Front strut travel is an axial test-jig demonstration: the mount and spring upper end remain fixed while the lower seat/outer tube move, changing spring length. Full MacPherson camber/toe, link trajectories, loads and ECS valving are not solved.
- Brake pads approach opposing rotor faces and the rotor slows to a stop over an illustrative cycle. Gaps and travel are exaggerated, not service clearances or a stopping-distance calculation.
- Clutch animation demonstrates disconnection and equal angular rates while connected, with idealized transition rather than contact/torque simulation.
- The external 20:40 gear pair has opposite rotation and an exact 2:1 angular ratio.
- The ideal open differential preserves (left angle + right angle)/2 = case angle. Tooth shapes and spider contact are schematic; no limited-slip controller or traction model is supplied.
- Steering uses constant-length tie rods solved against a translating rack and vertical steering pivots. Actual Ackermann/caster/camber, EPS control, joint elasticity and CV ball-track mechanics are not reproduced.
- Wheel rotation is shown on a stationary observation model; vehicle translation and tire-road forces are explained, not simulated.

Additional primary references:
- KYB, How shocks work: https://www.kyb.com/resources/shocks-struts-101/how-shocks-work/ — spring vs damper function and internal flow restriction.
- DENSO, Thermostats: https://www.denso-am.eu/products/ac-engine-cooling/thermostats — engine temperature and radiator-flow control.
- ZF Aftermarket, Passenger car clutches: https://aftermarket.zf.com/en/aftermarket-portal/our-portfolio/passenger-cars/products/clutches/ — clutch components and cooperation.
- Bosch Mobility, Electric power steering: https://www.bosch-mobility.com/en/solutions/steering/electric-power-steering-systems/ — steering assistance system context.
- Bosch Mobility, Electronic stability program: https://www.bosch-mobility.com/en/solutions/driving-safety/electronic-stability-program/ — wheel-brake control and sensor context.
- Garrett and Bosch GDI references listed above continue to support turbo and fuel-system relationships. None of these references asserts that their specific products are fitted to the reference car.

Verification checks all referenced parts and lesson links, replay/scrub/pause, restoration to static exploration, gear ratio, differential average, actual steering-link endpoints/length across nine poses, fixed spring top, quizzes and mobile overflow. Recorded in `artifacts/systems-validation.json`; original car and engine tests remain included.

## Complete engine-to-wheel lesson

The new `power-path` lesson embeds the existing procedural engine as one `source-engine` assembly in the drivetrain scene, increasing that view to 36 selectable groups and six lessons (230 groups / 24 lessons across detailed views). No downloaded geometry or new OEM accuracy claim is introduced.

Six teaching steps follow engine, clutch, transmission, differential, drive shafts and tires. Step navigation updates red selection and explanatory text. Stages are teaching focus, not delayed sequential activation of real drivetrain components. Motion reuses the engine slider-crank state, maintains the 20:40 gear ratio, assumes a 1:1 additional final reduction and equal wheel speeds for straight-line travel. Functional flow lines bridge the exploded functional layout.

The clutch comparison freezes downstream angles at their current positions while the engine continues to run. It is an explicit observation constraint illustrating loss of torque connection, not a claim that real wheels stop immediately when disengaged. Inertia, slip and clutch engagement transients remain outside scope.

The named deep link and engine-to-drivetrain lesson entry are checked in `artifacts/power-path-validation.json`, along with six-stage focus, source-engine synchronization, through-path ratio, disconnect/reconnect and mobile display.
