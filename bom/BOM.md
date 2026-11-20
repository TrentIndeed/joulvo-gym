# Bill of materials

> **Draft, November 20, 2026. CAD only: nothing here is built in metal or load-tested.** This is the parts list for V1 and the
> four builds that follow it, as they are drawn now. Every number is a design estimate. The list is confirmed, with exact
> counts, in the verified release after a prototype has been built and load-tested. Prices are planning figures read on the
> dates shown, not quotes; stock and prices change. Nothing here is endorsed by the suppliers.

The [website](https://kinetiqgym.com/build#parts) has the same list with per-build totals and editable prices.

**How the list is organized.** The **main list** is what a builder has to buy, from the motor and controller down to the
metal stock. Small bulk parts are priced by the pieces used; the note gives the pack. A line marked **to come** has no price
on record yet: it is listed, and left out of the totals. The **accessory list** is what many builders already have, and is
not in the totals. The common screws, nuts and inserts come from the assortments in the accessory list; the fastener table
below gives V1's sizes and counts.

## The builds

V1 is the current design. The other four are V1 with a few parts swapped: the same frame, drum, rope guide and exit.

| Build | Status | Resistance | Motor | Controller | Power | Mount | Priced lines so far | Lines to come |
|---|---|---|---|---|---|---|---:|---:|
| **V1** | CAD, not built yet | 180 lb (design target) | APS 8072S, direct drive | ODrive Pro | 10S battery: two 5S LiPo packs | Rack upright, quick release | $1,635.71 | 5 |
| **V1 (220 battery)** | CAD first look, not built | 220 lb (design target; not yet calculated for this build) | Hobbywing XRotor V11130, direct drive | Flipsky 75200 (VESC type) | 10S battery: two 5S LiPo packs | Rack upright, quick release | $1,984.70 | 8 |
| **V1 wall power (220)** | CAD first look, not built | 220 lb (design target; V1's parts are calculated at 180 lb only) | APS 8072S, direct drive | ODrive Pro with a regen clamp | 48 V, 1,000 W wall supply in a floor box | Rack upright, quick release | $1,706.14 | 6 |
| **V1 budget wall power** | CAD first look, not built | 180 lb (design target; it depends on the controller's real current limit) | APS 8072S, direct drive | ODESC V4.2 | 48 V, 600 W wall supply in a floor box | Rack upright, quick release | $1,070.58 | 7 |
| **V1 wall mount (300)** | CAD first look, not built | 300 lb (design target; not yet calculated for this build) | Hobbywing XRotor V11130, direct drive | Flipsky 75200 (VESC type) with a regen clamp | 48 V, 1,000 W wall supply in a floor box | Wall studs: 8 lag screws | $2,030.27 | 10 |

**About the numbers.** Nothing is built in metal or load-tested, so there are no ratings here: each resistance is a design
target. V1's 180 lb is about where the calculation reaches the controller's current limit on the 1 in drum. The 220 and 300 lb
builds are shape-and-fit first looks, and V1's drive parts (coupling, shaft, drum, bearings, plates) have only been calculated
at V1's load. The budget build's 180 lb waits on a bench test of its controller. V1 at 180 lb is built first; the 220 lb
battery build is planned to become the main build after it.

- **V1:** V1 is the current design. An APS 8072S outrunner turns a 1 in drum through one bought coupling, with no belt or gear. The frame is a box of five 3/8 in 6061 plates; the covers and the deck are printed. An ODrive Pro drives the motor from two 5S LiPo packs in series behind a BMS and a 60 A fuse, and the packs take the energy back when the weight is lowered. A Raspberry Pi 4 with a 4 in touchscreen and a small control board with a Teensy 4.0 run it. The rope winds in one even layer behind a geared rope guide and leaves through an exit that swivels on two bearings; it is drawn to touch only metal on the way out.The rack mount is a quick release: two 1 in pins hold it on the upright, the unit hangs on four studs and a spring latch locks it. 180 lb is the design target: it is about where the calculation reaches the controller's current limit on this drum. Nothing is built in metal or load-tested. Every number is a design estimate from the CAD and from hand calculations, and may change.
- **V1 (220 battery):** V1 with the stronger motor. A Hobbywing V11130 sits in a cage on a wider motor plate at V1's motor end, a Flipsky 75200 stands behind the packs in a longer end cap, and a small encoder board takes the ODrive's place. Everything else is V1's: the same parts in the same places. It is a shape-and-fit first look: V1's coupling, shaft, drum, bearings and plates have only been calculated at V1's load, the motor's heat is not calculated, the controller's mount is a place-holder and the handle has no place yet. 220 lb is the target the build is named for, not a result. Nothing is built in metal or load-tested. Every number is a design estimate from the CAD and from hand calculations, and may change.
- **V1 wall power (220):** V1 with the battery taken out. A Mean Well 1,000 W supply sits in a box on the floor and feeds 48 V to V1's port. With no battery to take the energy when the weight is lowered, a regen clamp and two brake resistors on an aluminum bracket turn it into heat. Everything else is V1's: the same parts in the same places. It is a shape-and-fit first look: nothing in it has been calculated at 220 lb, and the supply limits how fast the weight can be reeled in under load (not yet recalculated for this drum). Nothing is built in metal or load-tested. Every number is a design estimate from the CAD and from hand calculations, and may change.
- **V1 budget wall power:** V1 with the costly electronics left out. No packs, no Pi, no screen and no ODrive Pro: an ODESC V4.2 on an aluminum bracket with two brake resistors drives the motor, a small encoder board reads the drum shaft, a XIAO ESP32-C3 takes the control board's place, and a knob sits where the screen was. A Mean Well 600 W supply sits in a box on the floor. Everything else is V1's: the same parts in the same places. It is a shape-and-fit first look: the ODESC's current limit is the seller's figure and unconfirmed, so its 180 lb is a target that waits on a bench test, and the 600 W supply limits how fast the weight can be reeled in. Its app does not exist yet. Nothing is built in metal or load-tested. Every number is a design estimate from the CAD and from hand calculations, and may change.
- **V1 wall mount (300):** V1 turned to hang on a wall, with its rope wheels facing up. A wall kit of aluminum bars, straps and a shelf takes the place of the rack mount and bolts to two studs with eight lag screws. It has the V11130 motor on a wider motor plate, a Flipsky 75200 on the wall kit, a regen clamp with two brake resistors, and a 1,000 W supply on the floor. Everything else is V1's: the same parts in the same places. It is a shape-and-fit first look: V1's coupling, shaft, drum, bearings and plates have only been calculated at V1's load, far below this build's target, and they will need to change before 300 lb is more than a name. The wall itself is yours to check. Nothing is built in metal or load-tested. Every number is a design estimate from the CAD and from hand calculations, and may change.

Direct drive only: the motor turns the drum through one coupling, with no belt or gear between them. Nothing is welded or
turned on a lathe: round parts are bought at their final size and cut to length.

## Main list

### Motor and controller

| Qty | Part | Builds | Unit price | Price read | Notes |
|---|---|---|---|---|---|
| 1 | [APS 8072S outrunner, 50 Kv](https://alienpowersystem.com) | V1, Wall power, Budget | $220.00 (est.) | Recorded Oct 2026 | The motor of V1 and of the two wall-power builds that keep it. Alien Power Systems, UK: about GBP 169 plus shipping, so the dollar figure is an estimate and has not been re-checked since October. 10 mm keyed shaft. |
| 1 | [Hobbywing XRotor V11130, 55 Kv](https://www.hobbywingdirect.com/products/eps-vtol-motor-11130) | 220 battery, Wall mount | $669.99 | Checked Nov 15-16, 2026 | The larger motor of V1 (220 battery) and V1 wall mount (300). Hobbywing North America's store price; the order needs the maker's release form. Its rotor thread depth and bearing limits are not published, so its mount is a first drawing. |
| 1 | [ODrive Pro](https://shop.odriverobotics.com/products/odrive-pro) | V1, Wall power | $229.00 | Checked Oct 2, 2026 | Controller only; the heat spreader is separate. It reads a magnet on the end of the drum shaft with its own encoder. |
| 1 | [ODrive Pro heat spreader](https://shop.odriverobotics.com/) | V1, Wall power | $25.00 (est.) | Estimate | Bolts the ODrive to the far bearing plate, which carries its heat away. |
| 1 | [Thermal pad, 100 x 100 x 1.5 mm (ARCTIC TP-3)](https://www.amazon.com/dp/B09V52NPBS) | V1, Wall power | $8.99 | Checked Nov 12, 2026 | Between the heat spreader and the far plate (the drawing has 2.0 mm squeezed to 1.5; the thickness is to be settled on the prototype). Only if your heat spreader came without a pad. |
| 1 | [Flipsky 75200 Pro V2.0 controller (VESC type)](https://flipsky.net/search?q=75200) | 220 battery, Wall mount | $150.00 | Checked Nov 15-16, 2026 | The controller for the V11130 builds. The price is the store's "from" price. Its mount in the drawing is a place-holder. |
| 1 | [ODESC V4.2 56 V controller (SEQURE)](https://www.amazon.com/dp/B0FH9DXFG7) | Budget | $49.99 | Checked Oct 26, 2026 | The budget controller. Its current limit is the seller's figure and unconfirmed: it is the first thing to bench-test on this build. |
| 1 | [Thermal pad, 100 x 100 x 0.5 mm (ARCTIC TP-3)](https://www.amazon.com/dp/B09V53W559) | Budget, Wall mount | $6.99 | Checked Oct 26, 2026 | Between the ODESC or the Flipsky and its aluminum bracket. |
| 1 | [AS5047P encoder board](https://www.amazon.com/dp/B0H15G7NPX) | 220 battery, Budget, Wall mount | $11.99 | Checked Oct 26, 2026 | Reads the magnet on the drum shaft's end where the ODrive Pro is left out. On a 1/8 in plate on the ODrive's three mounting points. |
| 1 | Diametric magnet, 6 x 5 mm, N45SH | All | to come | Price to come | The encoder's magnet, in the end of the drum shaft. Listing to be picked. |
| 1 | [ODrive Regen Clamp](https://shop.odriverobotics.com/) | Wall power, Wall mount | $89.00 | Recorded Oct 28, 2026 | Wall-power builds only: with no battery to take the energy when the weight is lowered, the clamp sends it to the brake resistors. |
| 1 | [Brake resistors, 1 ohm, aluminum case, 2](https://www.amazon.com/dp/B077ZMFZM6) | Wall power, Budget, Wall mount | $4.00 (est.) | Checked Oct 26, 2026 | On the aluminum heat bracket. Drawn as 50 W stand-ins; the price is 2 of a 5-pack of 100 W resistors ($9.99). Size and listing to be confirmed with the bench test. |

### Power

| Qty | Part | Builds | Unit price | Price read | Notes |
|---|---|---|---|---|---|
| 2 | [Thunder Power TP3300-5SR70 LiPo pack, 5S 3.3 Ah](https://www.thunderpowerrc.com/products/tp3300-5sr70) | V1, 220 battery | $129.99 | Recorded Nov 2, 2026 | Two in series: 10S, 42 V fully charged, about 122 Wh. Built to order by the maker. $129.99 with bare leads, $134.99 with EC5 fitted. The packs take the energy when the weight is lowered: there is no brake resistor on the battery builds. |
| 1 | [JBD 10-17S 80 A smart BMS (Bluetooth)](https://www.ebay.com/itm/398016908803) | V1, 220 battery | $44.57 | Recorded Nov 2, 2026 | Set for 10S. One temperature probe; charge and discharge through one port. |
| 1 | [Main fuse, Littelfuse BF1 60 A 58 V (142.5631.5602)](https://www.digikey.com/en/products/result?keywords=142.5631.5602) | All | $4.70 | Checked Nov 18, 2026 | One in use; buy a spare. |
| 1 | [Main fuse holder, Littelfuse MIDI in-line (04980921GXM5)](https://www.digikey.com/en/products/result?keywords=04980921GXM5) | All | $9.35 | Checked Nov 18, 2026 | The seller's description and its spec table disagree on the voltage (32 V and 58 V): check the maker's sheet before ordering. |
| 1 | [MINI 58 V 10 A fuse (Littelfuse 0997010.WXN)](https://www.digikey.com/en/products/result?keywords=0997010.WXN) | V1, 220 battery | $1.10 | Checked Oct 12, 2026 | The charge fuse. |
| 1 | [In-line MINI fuse holder, 58 V DC (Littelfuse 0FHM0003ZXJS)](https://www.digikey.com/en/products/result?keywords=0FHM0003ZXJS) | V1, 220 battery | $6.39 | Checked Oct 12, 2026 | Holds the charge fuse. |
| 1 | [42 V 2 A charger (10S)](https://www.amazon.com/dp/B08JYSZX78) | V1, 220 battery | $16.99 | Recorded Oct 3-5, 2026 | Plugs into the charge port. |
| 1 | [Mean Well RSP-1000-48 power supply](https://www.jameco.com/) | Wall power, Wall mount | $277.40 | Recorded Oct 28, 2026 | 48 V, about 1,000 W, in a box on the floor: only 48 V DC goes up to the unit. The supply sets how fast the weight can be reeled in under load; that speed has not been recalculated for V1's drum. |
| 1 | [Mean Well LRS-600N2-48 power supply](https://www.trcelectronics.com/products/mean-well-lrs-600n2-48) | Budget | $84.69 | Checked Oct 26, 2026 | 48 V, 600 W, in a box on the floor. The supply sets how fast the weight can be reeled in under load; not recalculated for V1's drum. |
| 1 | Mains inlet (C14) with fuse and lit switch, and a 12 A slow-blow fuse | Wall power, Wall mount | $10.00 (est.) | Estimate | The floor box's inlet for the 1,000 W supply. Listing to be picked. |
| 1 | [Mains inlet, pre-wired with fuse and lit rocker switch (10 A 125 V)](https://www.amazon.com/dp/B09DRLYD2Z) | Budget | $7.99 | Checked Oct 26, 2026 | The floor box's inlet and on/off switch. |
| 1 | [Wall cord, C13 to NEMA 5-15P, 16 AWG, 10 ft](https://www.amazon.com/dp/B003KQ0O9S) | Wall power, Budget, Wall mount | $8.29 | Checked Oct 26, 2026 | The floor box to a 120 V outlet. |
| 1 | [Power cable, 2-core silicone, 10 ft](https://www.amazon.com/dp/B0B9JBG1SH) | Wall power, Budget, Wall mount | $9.98 | Checked Oct 26, 2026 | From the floor box up to the unit, cut to length. The price is a 14 AWG cable; the gauge for the 1,000 W builds is still to be chosen. |
| 1 | [XT60 pairs with silicone leads, 2-pack](https://www.amazon.com/dp/B07BF8154S) | Wall power, Budget, Wall mount | $6.99 | Checked Oct 26, 2026 | The power cable's plug at the unit. |

### Drum and drive

| Qty | Part | Builds | Unit price | Price read | Notes |
|---|---|---|---|---|---|
| 1 | [Misumi MCOCGWK34 Oldham coupling, 10 mm keyed to 12 mm keyed](https://us.misumi-ec.com/) | All | $91.04 | Checked Nov 18, 2026 | Joins the motor shaft to the drum shaft: the drive is direct, with no belt or gear. On the V11130 builds the motor side is 12 mm; that bore is still to be confirmed in the catalogue, and the coupling has only been checked at V1's load. |
| 1 | [Drum shaft, 12 mm hardened, keyed, cut to 228.3 mm (Misumi SFJ12)](https://us.misumi-ec.com/) | All | $18.09 | Checked Nov 18, 2026 | Bought cut to length with its keyway: nothing is turned. |
| 1 | [Machine key, 4 x 4 x 12 mm](https://www.amazon.com/dp/B0CYNXCSV7) | All | $0.07 | Checked Nov 18, 2026 | The drum shaft's key. Priced by the piece: 1 of a 140-piece key set ($9.48). The APS motor comes with its own 3 mm key. |
| 2 | [SKF 1201 ETN9 self-aligning ball bearing, 12 x 32 x 10](https://www.zoro.com/i/G9417877/) | All | $58.69 | Checked Nov 18, 2026 | The drum's two bearings, one in each bearing plate. Self-aligning, because the two plates are separate parts. A no-name 1201 costs about a third as much (NTN 1201, $18.70 each, same date); its lower ratings have not been checked against the drum loads. |
| 2 | [goBILDA 1301-0016-0012 clamping hub, 12 mm](https://www.gobilda.com/) | All | $9.99 (est.) | Estimate | One at each end of the drum. |
| 1 | [Drum tube, 6061, 1 in OD x 0.12 in wall, 12 in](https://www.amazon.com/dp/B0BNQ5F985) | All | $15.99 | Checked Nov 19, 2026 | One cut to 138 mm, used as bought: no lathe. |
| 1 | [AmSteel-Blue rope, 1/8 in x 25 ft](https://www.amazon.com/dp/B0B8WKH8L1) | All | $20.95 | Checked Oct 26, 2026 | One rope in use (2.0 m of pull plus the wraps that stay on the drum) and the rest for the next one. It laces through three holes in the drum flange and ties round the bar between two of them. Inspect it often and replace it when fuzzy, glazed, flat or stiff. |
| 1 | [Loctite 638 retaining compound, 50 mL](https://www.amazon.com/dp/B000O01EV0) | All | $14.82 | Checked Nov 19, 2026 | In the drum flange bores. |
| 1 | V11130 motor mount: 4 spacers 12 x 75 mm (M6), a keyed 12 mm stub shaft and its key | 220 battery, Wall mount | to come | Price to come | A first drawing: the parts are not chosen yet. |

### Level-wind

| Qty | Part | Builds | Unit price | Price read | Notes |
|---|---|---|---|---|---|
| 1 | [MGN15 rails, 200 mm, with MGN15H blocks, 2-pack](https://www.amazon.com/dp/B0D7CLND4B) | All | $49.99 | Checked Oct 26, 2026 | Both rails and blocks carry the rope guide's carriage. Each rail is cut about 20 mm shorter with an abrasive cut-off wheel (the rail is hardened). |
| 1 | [Tr8 x 2 lead screw, 250 mm, with brass nut, 2-pack](https://www.amazon.com/dp/B095M8ZKDF) | All | $13.59 | Checked Nov 19, 2026 | One used, cut to about 220 mm; one spare. It must be single start with a 2 mm lead: some listings of this size are 4 start. |
| 2 | [NATR6-PP track rollers, 6 x 19 x 12](https://www.zoro.com/i/G409927912/) | All | $31.45 | Checked Nov 18, 2026 | The two rollers the rope runs between on the carriage. Each sees more than the rope's own pull, which is why they are track rollers and not plain bearings. |
| 1 | [Shoulder screws ISO 7379, 6 x 16, M5, 6-pack](https://www.amazon.com/dp/B0DP6ZRSTT) | All | $3.00 | Recorded Oct 3-5, 2026 | The two track rollers' axles. Priced by the piece: 2 of 6 ($8.99). |
| 1 | [688ZZ bearings, 5-pack](https://www.amazon.com/dp/B08199J4RJ) | All | $5.99 | Recorded Oct 3-5, 2026 | Two carry the lead screw. |
| 1 | [F8-16M thrust bearings, 4-pack](https://www.amazon.com/dp/B07QLTXJDH) | All | $7.99 | Recorded Oct 3-5, 2026 | Two take the lead screw's end load. |
| 1 | [8 mm set-screw shaft collars, 10-pack](https://www.amazon.com/dp/B08SK2LNNV) | All | $2.67 | Recorded Oct 3-5, 2026 | Three on the lead screw. Priced by the piece: 3 of 10 ($8.89). |

### Rope exit

| Qty | Part | Builds | Unit price | Price read | Notes |
|---|---|---|---|---|---|
| 1 | [6812-2RS bearings, 60 x 78 x 10, 2-pack](https://www.amazon.com/dp/B082PSBTLP) | All | $14.39 | Checked Nov 19, 2026 | The exit swivels on this pair, so it follows the direction of the pull. |
| 1 | [6000-2RS bearings, 10 x 26 x 8, 4-pack](https://www.amazon.com/dp/B07S9MHMXS) | All | $7.99 | Checked Nov 19, 2026 | Two used: the rope runs on their bare outer rings. Two spare. |
| 1 | [626 bearings, 6 x 19 x 6, 10-pack](https://www.amazon.com/dp/B07JHKBG4X) | All | $4.40 | Checked Oct 26, 2026 | The four fixed wheels behind the swivel. Priced by the piece: 4 of 10 ($10.99, shielded 626ZZ; the drawing names sealed 626-2RS). |
| 1 | [Misumi precision collars: 2 x D10, bore 3.2, L 7.9 and 4 x D7, bore 3.2, L 3.1](https://us.misumi-ec.com/) | All | to come | Price to come | Spacers on the two rope wheels' axles. Configured parts: the price shows only after sign-in. |
| 1 | [Shim washers DIN 988, 6 x 12 mm, assorted pack](https://www.amazon.com/dp/B0C823SVYN) | All | $11.99 | Checked Nov 19, 2026 | Eight of the 0.5 mm shims. Check the pack holds eight of that thickness. |
| 1 | [Hardened dowel pins 6 x 28 mm, 10-pack](https://www.zoro.com/i/G3424185/) | All | $0.66 | Checked Nov 19, 2026 | The fixed wheels' two axles. Priced by the piece: 2 of 10 ($3.29). Check the listing says hardened. |
| 1 | [Hardened dowel pins 3 x 12 mm (ISO 8734), 100-pack](https://www.amazon.com/dp/B0F54FJXY1) | All | $0.14 | Checked Nov 19, 2026 | Priced by the piece: 2 of 100 ($6.79). |
| 1 | [M3 x 40 socket head screws, class 12.9, 60-pack](https://www.amazon.com/dp/B0DJQGP65Q) | All | $0.51 | Checked Nov 19, 2026 | The exit to the front plate, into nuts in pockets. Priced by the piece: 4 of 60 ($7.64). |
| 1 | [M2.5 x 30 socket head screws, class 12.9, 100-pack](https://www.amazon.com/dp/B0DDXLS817) | All | $0.31 | Checked Nov 19, 2026 | Priced by the piece: 4 of 100 ($7.86). |
| 1 | [M2.5 x 25 socket head screws, class 12.9, 30-pack](https://www.amazon.com/dp/B0CG28G69S) | All | $0.47 | Checked Nov 19, 2026 | Priced by the piece: 2 of 30 ($6.99). |
| 1 | [M2.5 x 20 button head screws, class 10.9, 100-pack](https://www.amazon.com/dp/B01AXUS35K) | All | $0.34 | Checked Nov 19, 2026 | The cheek's four screws. Priced by the piece: 4 of 100 ($8.49). |
| 1 | [M3 x 18 socket head screws, class 12.9, 100-pack](https://www.amazon.com/dp/B0FF3J6C1L) | All | $0.17 | Checked Nov 19, 2026 | The two rope wheels' axles. Priced by the piece: 2 of 100 ($8.39). |
| 1 | [Thin nuts DIN 439: M3 (100-pack) and M2.5 (50-pack)](https://www.zoro.com/i/G1843031/) | All | $0.32 | Recorded Nov 20, 2026 | Two M3 and four M2.5. Priced by the piece ($4.19 and $2.99 a pack). Check the M2.5 nut's height reads 1.6 mm. |

### Rack mount and latch

| Qty | Part | Builds | Unit price | Price read | Notes |
|---|---|---|---|---|---|
| 4 | [Shoulder screws ISO 7379, 12 x 12, M10](https://www.zoro.com/) | V1, 220 battery, Wall power, Budget | $4.47 | Checked Nov 19, 2026 | The four studs the unit hangs on. $17.89 for the four. |
| 1 | [M10 ball spring plungers, pack](https://www.amazon.com/dp/B0FRGKKNPV) | V1, 220 battery, Wall power, Budget | $6.19 | Checked Nov 19, 2026 | Two hold the unit on the stud heads. |
| 1 | [Shoulder screws ISO 7379, 5 x 10, M4, pack](https://www.amazon.com/dp/B0DP7173LB) | V1, 220 battery, Wall power, Budget | $6.89 | Checked Nov 19, 2026 | Two guide the latch slider. |
| 1 | Latch small parts: one ISO 7379 8 x 10 M6 shoulder screw with a thin nut, one compression spring 0.5 x 4 x 40 mm | V1, 220 battery, Wall power, Budget | to come | Price to come | Listings to be picked. |
| 1 | [UHMW sheet, 1/16 in](https://www.amazon.com/dp/B0F6V9N1DB) | V1, 220 battery, Wall power, Budget | $9.69 | Checked Nov 18, 2026 | Two liners on the rack cheeks, so plastic and not aluminum meets the upright. |

### Wall mount

| Qty | Part | Builds | Unit price | Price read | Notes |
|---|---|---|---|---|---|
| 1 | Wall kit metal: 6061 bar 3/8 x 5 x 19 in and 3/8 x 3 x 19 in, two 3/4 x 1-1/2 in straps, a 3/4 x 4 in shelf, two 3/8 in cheeks | Wall mount | to come | Price to come | A first drawing of the wall mount; not priced. |
| 8 | Lag screws 3/8 x 4 in with washers | Wall mount | $1.10 (est.) | Recorded Oct 28, 2026 | Into two wall studs, over plywood packers. From a hardware store. |
| 4 | M8 x 45 hex bolts and nuts | Wall mount | to come | Price to come | The unit to the wall kit. |

### Controls and screen

| Qty | Part | Builds | Unit price | Price read | Notes |
|---|---|---|---|---|---|
| 1 | [Raspberry Pi 4 Model B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) | V1, 220 battery, Wall power, Wall mount | $55.00 (est.) | Estimate | Runs the touchscreen app. |
| 1 | [Waveshare 4 inch HDMI LCD (C), 720 x 720 touchscreen](https://www.amazon.com/dp/B09QKR364V) | V1, 220 battery, Wall power, Wall mount | $78.99 | Checked Oct 13, 2026 | Flush in the left cover. |
| 1 | [Flat HDMI cable kit, HDMI to 90-degree micro-HDMI, 10 cm](https://www.amazon.com/dp/B0HGXD92P2) | V1, 220 battery, Wall power, Wall mount | $7.98 | Checked Oct 13, 2026 | The Pi to the screen. |
| 1 | [Flat USB-C cable, 0.2 m, angled, USB-A to USB-C](https://www.amazon.com/dp/B096YFM5QB) | V1, 220 battery, Wall power, Wall mount | $8.99 | Checked Nov 18, 2026 | The screen's touch and power lead. |
| 1 | [90-degree USB-A adapters, 4-pack](https://www.amazon.com/dp/B0C7V37X25) | V1, 220 battery, Wall power, Wall mount | $7.59 | Checked Oct 13, 2026 | One on the Pi. |
| 1 | [Teensy 4.0](https://www.pjrc.com/store/teensy40.html) | V1, 220 battery, Wall power, Wall mount | $25.00 (est.) | Estimate | The real-time controller: it plugs into the small control board. |
| 1 | Small control board (carries the Teensy 4.0, a CAN transceiver and the 5 V regulator) | V1, 220 battery, Wall power, Wall mount | to come | Price to come | A small custom board that replaces three hand-wired boards. It is still being designed; its price comes with it. |
| 1 | [Noctua NF-A4x10 5V fan](https://www.amazon.com/dp/B00NEMGCIA) | All | $15.95 | Checked Oct 26, 2026 | Moves air across the controller. |
| 1 | [APIELE 12 mm latching switch, 2-pack](https://www.amazon.com/dp/B083QMF2J1) | All | $8.99 | Recorded Oct 2026 | The power switch. |
| 1 | [Seeed XIAO ESP32-C3](https://www.amazon.com/dp/B0B94JZ2YF) | Budget | $9.90 | Checked Oct 26, 2026 | The budget build's controller board: a knob and a phone link in place of the Pi and the screen. |
| 1 | [EC11 push-button rotary encoders with knob caps, 6-pack](https://www.amazon.com/dp/B0C6Q67V97) | Budget | $8.88 | Checked Oct 26, 2026 | One used: turn it to set the weight. |
| 1 | [Pololu APM81815 5 V regulator carrier (#5267)](https://www.pololu.com/product/5267) | Budget | $6.95 | Checked Oct 26, 2026 | Runs the XIAO and the fan from 48 V. Plus shipping. |
| 1 | Perfboard, two 7-pin header strips and a 47 uF 63 V capacitor | Budget | to come | Price to come | The XIAO's board. Small parts from a kit; not priced. |

### Connectors and charging

| Qty | Part | Builds | Unit price | Price read | Notes |
|---|---|---|---|---|---|
| 1 | [Amass XT60E-F panel socket, 10-pack](https://www.amazon.com/dp/B09SL2MNN1) | All | $0.99 | Recorded Oct 2026 | One used. Battery builds: the charge port. Wall-power builds: the 48 V inlet. Priced by the piece: 1 of 10 ($9.88). |
| 1 | [EC5 connectors, 10 pairs](https://www.amazon.com/dp/B08GPR7SVR) | V1, 220 battery | $4.80 | Recorded Oct 2026 | Three pairs on the pack leads. Priced by the piece: 3 of 10 pairs ($15.99). |
| 1 | [5S JST-XH balance leads, 10-pack](https://www.amazon.com/dp/B073ZGF8D9) | V1, 220 battery | $1.40 | Recorded Oct 2026 | Two, from the packs to the BMS. Priced by the piece: 2 of 10 ($6.99). |
| 1 | [WAGO 221-615 lever connector](https://www.amazon.com/dp/B07CJR8MH4) | All | $1.63 | Recorded Oct 2026 | The negative junction. Priced by the piece: 1 of a 15-pack ($24.39). |

### Metal stock

| Qty | Part | Builds | Unit price | Price read | Notes |
|---|---|---|---|---|---|
| 1 | [6061 plate, 3/8 x 12 x 12 in](https://www.zoro.com/i/G601840392/) | All | $46.39 | Checked Nov 19, 2026 | The box is five 3/8 in plates: rear, front, two bearing plates and the motor plate, joined by screws into the plate edges. This sheet and the next also give the rack cheeks, the latch slider, the drum flanges and three exit plates. Worked out by area only, with no nesting run: check the fit before ordering. |
| 1 | [6061 plate, 3/8 x 6 x 12 in](https://www.zoro.com/) | All | $19.15 | Checked Nov 12, 2026 | The rest of the 3/8 in parts (see the line above). |
| 1 | 6061 stock in the other thicknesses: 1/4 in plate (about 7 x 12 in), 3/4 in bar (about 5 x 12 in), 0.063 in sheet (3 x 6 in) | All | to come | Price to come | The gears, the carriage and the thin exit plates (1/4 in); the rack mating plate, the exit journal and cheek and the nut block (3/4 in); the three bearing clamps (0.063 in). The prototype uses stock already on the shelf, so no price is on record. |
| 1 | Extra metal for the V11130 motor: wide motor plates (3/4 in and 1/4 in, 116 x 116 mm) and a 7075 rotor block | 220 battery, Wall mount | to come | Price to come | A first drawing; not priced. |
| 1 | 6061 sheet, 1/8 in, about 62 x 45 mm | 220 battery, Budget, Wall mount | to come | Price to come | The encoder board's plate. Not priced. |
| 1 | 6061 bar, 1/4 x 3 in, about 100 mm | Wall power, Budget, Wall mount | to come | Price to come | The heat bracket for the controller or the brake resistors. Not priced. |

## Screws, nuts and small hardware (V1)

Counted from the V1 drawing. The counts are confirmed with the verified build files; the other builds differ by a few screws.

| Qty | Size |
|---|---|
| 3 | 3 x M3 washer ISO 7089 |
| 2 | 6000-2RS ball bearing 10 x 26 x 8, the rope on its bare outer ring |
| 4 | 626-2RS, 6 x 19 x 6 (SKF 626-2RSH: C0 0.95 kN) |
| 2 | 6812-2RS, 60 x 78 x 10 |
| 2 | 688ZZ bearing 8 x 16 x 5 |
| 1 | Cable tie 100 x 2.5 |
| 2 | Cable tie 200 x 2.5 |
| 2 | Cable tie 300 x 3.6 |
| 4 | DIN 988 shim washer 6 x 12 x 0.5, one at each end of each fixed-wheel stack |
| 4 | DIN 988 shim washer 6 x 12 x 0.5 |
| 2 | F8-16M thrust bearing 8 x 16 x 5 |
| 4 | ISO 7379 shoulder screw 12 x 12, M10 |
| 2 | ISO 7379 shoulder screw 5 x 10, M4 |
| 2 | ISO 7379 shoulder screw 6 x 16, M5, class 12.9 |
| 1 | ISO 7379 shoulder screw 8 x 10, M6 |
| 1 | Key 3 x 3 x 12 (comes with the motor) |
| 1 | Key 4 x 4 x 12, DIN 6885 A |
| 2 | M10 x 19 ball plunger |
| 4 | M2.5 nut DIN 439 thin |
| 10 | M2.5 nut ISO 4032 / DIN 934 |
| 2 | M2.5 x 10 flat head ISO 10642 |
| 2 | M2.5 x 10 pan / button head |
| 4 | M2.5 x 20 pan / button head, class 10.9 |
| 2 | M2.5 x 25 socket head ISO 4762, class 12.9 |
| 2 | M2.5 x 3 heat-set insert, brass |
| 4 | M2.5 x 30 socket head ISO 4762, class 12.9 |
| 4 | M2.5 x 4 heat-set insert (brass, OD 4.0 |
| 2 | M2.5 x 5 pan / button head |
| 3 | M2.5 x 6 pan / button head |
| 4 | M2.5 x 6 socket head ISO 4762 |
| 4 | M2.5 x 8 flat head ISO 10642 |
| 2 | M3 nut DIN 439 thin |
| 19 | M3 nut ISO 4032 / DIN 934 |
| 11 | M3 x 10 flat head ISO 10642 |
| 6 | M3 x 10 socket head ISO 4762 |
| 5 | M3 x 12 flat head ISO 10642 |
| 1 | M3 x 12 set screw |
| 2 | M3 x 12 socket head ISO 4762 |
| 1 | M3 x 14 flat head ISO 10642 |
| 5 | M3 x 16 flat head ISO 10642 |
| 4 | M3 x 16 low head DIN 7984 |
| 10 | M3 x 16 socket head ISO 4762 |
| 2 | M3 x 18 socket head ISO 4762, class 8.8 |
| 2 | M3 x 25 pan / button head |
| 4 | M3 x 25 socket head ISO 4762 |
| 4 | M3 x 4 heat-set insert (brass, OD 4.2) |
| 4 | M3 x 4 heat-set insert (d4.2) |
| 4 | M3 x 40 socket head ISO 4762, class 12.9 |
| 12 | M3 x 5 flat head ISO 10642 |
| 2 | M3 x 5 set screw |
| 8 | M3 x 6 flat head ISO 10642 |
| 4 | M3 x 6 pan / button head |
| 4 | M3 x 8 flat head ISO 10642 |
| 8 | M4 x 12 low head DIN 7984 |
| 6 | M4 x 12 socket head ISO 4762 |
| 2 | M4 x 16 flat head ISO 10642 |
| 2 | M4 x 16 socket head ISO 4762 |
| 2 | M5 clamp screw (comes with the Misumi hub) |
| 4 | M5 nut ISO 4032 / DIN 934 |
| 4 | M5 x 10 fan screw |
| 20 | M5 x 14 socket head ISO 4762 |
| 8 | M5 x 16 flat head ISO 10642 |
| 16 | M5 x 20 flat head ISO 10642 |
| 2 | M5 x 25 socket head ISO 4762, class 8.8 |
| 4 | M6 washer ISO 7089 |
| 2 | MGN15 rail 200 mm, cut to 177 |
| 2 | MGN15H block (comes with the rail) |
| 1 | Misumi MCOCGWK34 spacer (comes with the coupling) |
| 2 | Misumi precision collar D10 x V3.2 x L7.9 (configurable |
| 4 | Misumi precision collar D7 x V3.2 x L3.1 (configurable |
| 2 | Rack pin 1 in x 5 in (the rack's) |
| 2 | Rack pin clip (the rack's) |
| 2 | SKF 1201 ETN9 self-aligning bearing 12 x 32 x 10 |
| 1 | STUDY_Tr8_flange_nut |
| 1 | STUDY_lead_screw_Tr8x2_250mm_cut_to_220 |
| 1 | STUDY_shaft_collar_8mm_1 |
| 1 | STUDY_shaft_collar_8mm_2 |
| 1 | STUDY_shaft_collar_8mm_3 |
| 1 | Spring, 0.5 wire x 4 x 40 |
| 2 | Track roller NATR6-PP, 6 x 19 x 12 |
| 1 | V43_REF_motor_spacer_0 |
| 1 | V43_REF_motor_spacer_1 |
| 1 | V43_REF_motor_spacer_2 |
| 1 | V43_REF_motor_spacer_3 |
| 2 | goBILDA hub pinch screw (comes with the hub) |
| 2 | hardened dowel pin 3 x 12 (ISO 8734, m6) |
| 2 | hardened dowel pin 6 x 28 (m6) |

## Accessory list: check your parts bin first

Not in the totals. Buy only what is missing.

| Qty | Item | Builds | Unit price | Notes |
|---|---|---|---|---|
| 1 | M10 x 1.5 tap with an 8.5 mm drill | V1, 220 battery, Wall power, Budget | $10.92 | The rack mating plate's threaded holes. |
| 1 | [Cut-off wheels for a rotary tool (Dremel EZ456)](https://www.amazon.com/dp/B000FBLRVK) | All | $10.28 | To cut the two hardened rails and the lead screw. |
| 1 | [6 mm end mill for aluminum](https://www.amazon.com/dp/B09T3Q1Z5Y) | All | $15.39 | For the parts milled from 3/4 in stock. |
| 1 | Drills and taps | All | $25.00 (est.) | M2.5, M3 and M5 taps with a handle and their drills, for the holes in the plate edges and the few other threaded holes. |
| 1 | [USB isolator for controller setup](https://shop.odriverobotics.com/) | All | $35.00 (est.) | Protects the PC when you set up the controller over USB. |
| 1 | [Super Lube synthetic grease, 3 oz](https://www.amazon.com/dp/B000XBH9HI) | All | $10.99 | Lead screw and gears. |
| 1 | Silicone wire, mixed gauges | All | $45.00 (est.) | 10, 16, 18, 20, 22 and 26 AWG silicone wire. The wiring reference will give each wire's gauge and length. |
| 1 | [M5 ring terminals, pack](https://www.amazon.com/dp/B0DM8FW4LV) | All | $9.99 | 12–10 AWG terminals; verify selected listing. |
| 1 | Ferrules & heat-shrink | All | $15.00 (est.) | Consumables allowance; crimping tools excluded. |
| 1 | MicroSD card | V1, 220 battery, Wall power, Wall mount | $10.00 (est.) | For the Raspberry Pi. |
| 1 | [PETG filament, black, 1 kg x 2](https://www.amazon.com/dp/B0D41Y3WWZ) | All | $25.98 | The covers, the deck and the other printed parts are drawn in black PETG. The material and the amount are to be confirmed on the prototype. |
| 1 | Cable ties & thread locker | All | $12.00 (est.) | Assembly consumables allowance. |
| 1 | [Hitch pins, 1 x 5 in, with clips, 2-pack](https://www.amazon.com/dp/B0DRF883JL) | V1, 220 battery, Wall power, Budget | $15.97 | Two hold the rack mount on the upright. Or your rack's own 1 in pins. |
| 1 | [Steel snap hook, 396 lb (seller's rating)](https://www.amazon.com/dp/B09LXKGBHM) | All | $6.99 | Clips the handle to the rope. 4.8 stars (170). |
| 1 | [D-handle, 880 lb (Yes4All)](https://www.amazon.com/dp/B00FX34KDW) | All | $12.74 | Or any cable attachment you have. 4.8 stars (2,589). |
| 1 | [3DZWMAN heat-set insert kit, 380 pcs (M2 to M8, with tips)](https://www.amazon.com/dp/B0D2R955CL) | All | $18.99 | M2.5 and M3 inserts for the covers, the deck and the board posts. |
| 1 | [Metric socket screw assortment](https://www.amazon.com/dp/B0FJFVG31G) | All | $22.99 | M3, M4 and M5 socket head screws. The fastener table in the BOM lists every size and count. |
| 1 | [M3 flat-head assortment](https://www.amazon.com/dp/B0GS8FZLTK) | All | $15.00 (est.) | Purchase pack; the exact sizes and counts come with the build files. |
| 1 | [M4 flat-head assortment](https://www.amazon.com/dp/B0CW5Y4RQY) | All | $12.00 (est.) | Purchase pack; the exact sizes and counts come with the build files. |
| 1 | [M2.5 socket screw assortment](https://www.amazon.com/dp/B0FG2BYJSR) | All | $12.00 (est.) | Purchase pack; the exact sizes and counts come with the build files. |
| 1 | [Plain hex-nut assortment](https://www.amazon.com/dp/B097N3SGCD) | All | $9.00 (est.) | Purchase pack; the exact sizes and counts come with the build files. |

## No way to cut plate? Have the box plates made

One recorded price, not a quote for you: prices depend on the shop, the quantity and the lead time.

| Item | Builds | Recorded price (USD) | Notes |
|---|---|---|---|
| [The five box plates, laser cut from 3/8 in 6061](https://sendcutsend.com) | V1, 220 battery, Wall power, Budget | 333 | One of each plate at an instant-quote laser service, as its configurator showed on November 16, 2026: $333.25 for one set, $226.16 a set for five sets, before shipping and tax, with no tapping or countersinking. Quoted on a slightly longer version of the plates (278 mm, now 270 mm). The edge holes, the bearing seats and the countersinks are still yours to make. |

Ready-made metal kits are planned after testing. Nothing is for sale.

## Printed parts (V1)

Drawn in black PETG; the material and settings are confirmed on the prototype:

- the covers: the left cover (with the screen's window), the middle cover, the end cap, the rear hood, the bottom plate with
  its rope hatch, the trigger cover and the handle;
- inside: the electronics deck, the pack tray, the fuse holder and the motor spacer holder;
- the exit's cover (a sleeve and a front ring). The rope does not touch it.

The wall-power builds add a printed box for the supply on the floor. The budget build's left cover has no screen window and
carries the knob.
