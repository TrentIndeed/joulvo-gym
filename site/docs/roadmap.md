# Project roadmap

> **Status, November 20, 2026:** the design is now V1: one bolted aluminum frame, with four more builds that follow it by
> swapping a few parts (a larger motor, wall power, a budget build and a wall mount). V1 is drawn in CAD and still under
> review; the other four are shape-and-fit first looks. A 3D-printed prototype of the earlier design (V0) is on the bench.
> Nothing is built in metal or load-tested, and every number published so far is a design estimate.
>
> **The order:** V1 at 180 lb first; the 220 lb build becomes the main build after. Both figures are design targets.

## Where things stand

| Stage | Status |
|---|---|
| CAD design, V1: a box of five aluminum plates, the direct drive, the rope guide, the swivelling exit and the rack mount | drawn, in review |
| CAD design, the four builds that follow V1: V1 (220 battery), V1 wall power (220), V1 budget wall power, V1 wall mount (300) | first looks: shape and fit only |
| Printed fit test of the whole assembly | done, on the earlier design |
| Printed prototype of the earlier design (V0) with the real motor and electronics: wiring, software, low-force tests | on the bench |
| Bench tests: the motors' torque against current, the controllers' currents through a set, motor heat | next |
| V1 in aluminum (APS 8072S, 10S battery, 180 lb design target) | next |
| V1 (220 battery) as the main build (220 lb design target) | after V1 is built; today a first look |
| Load testing: static load in steps, then powered tests and thermal checks | after the build |
| V0's design files | after a verification pass; building V0 is not recommended |
| Verified release of V1: CAD, build files and software | after load testing |
| Metal kits made by Trent, the project's maker | after the verified release |

## The verified release

Nothing of V1 is released before the design is proven on real hardware, so nobody builds from an untested revision. When the
prototype passes its tests, one release will publish a matching set of:

- **CAD:** STEP models of every part and the assembly, DXF profiles of the plates, print files with the fit coupons, and
  editable CAD;
- **build files:** the confirmed parts list and hardware counts, the build instructions with photos and measured fit notes,
  and the wiring;
- **software:** the Raspberry Pi touchscreen app and its setup, the Teensy control firmware and its configuration, and the
  phone app (Bluetooth settings, workouts and history);
- **a validation report:** what was tested, how, and the results.

Each later release names one compatible set of CAD, parts list, wiring and software versions, and marks untested changes as
untested.

## V0's design files

V0 is the earlier design, 3D-printed and on the bench. Its design files will be available once a verification pass is done.
Building V0 is not recommended: V1 is the version to wait for.

They will go in their own folder of this repository, with a "not recommended to build" note on top, under the same licence as the
rest of the hardware design (CERN-OHL-S-2.0). Supplier CAD is not included.

## After the release

- **The Joulvo Gym Kit**, a metal kit: the five frame plates, the drum parts, the rope exit and the rack mount, made by Trent. Printed-part sets and complete machines may follow. Nothing is for sale before testing; the website
  has a kit waitlist.
- **Contributions** open with the verified release. Until then there is no tested design to contribute to. After it, useful
  contributions are build reports (revision, materials, settings, measurements and photos), CAD changes with what they
  affect, alternative batteries and motors with their test results, and documentation fixes.

## Licenses

For the verified release:

- hardware (CAD, drawings, print files): CERN-OHL-S-2.0;
- documentation and images: CC BY-SA 4.0;
- software: GPL-3.0.

Anyone will be able to build the design, change it and share their changes under these licenses. The Joulvo and Joulvo
Gym names and logo, and the earlier KINETIQ and Kinetiq Gym ones, are not licensed: only the project's maker sells kits and
machines under them. Supplier CAD and the ODrive firmware keep their own terms.

## Supporting the project

Support is a voluntary contribution, not an order or a kit pre-sale. It goes into building, testing and improving the
prototype (parts, aluminum stock and the revisions that come out of load testing) and into build support: clear
instructions and videos, fit coupons and test jigs. The website's support section has the link once a donation provider is
set up.
