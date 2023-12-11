 
include <box.scad>;
union() {
    difference() {
        MainBox();
    // remove angled display surface
    translate([140, 80, -5])
    rotate([45, 180, 90])
    cube([200, 100, 50], center = true);
        
    // make hole for printer
    translate([10, 10, -5])
        cube([56, 79, 20]);
        
    // make hole for display cables
    translate([120, -2.5, 18])
    rotate([0, -45, 0])
        cube([22, 10, 12]);
        
    // hole for usb-a
    translate([15, 147, 50])
    cube([14, 6, 10]);
    }

difference() {
translate([130, 75, 22.5])
rotate([45, 180, 90])
    cube([150, 56, 3], center = true);
        // scrw holes
    translate([166, 94, -15])
    rotate([45, 180, 90])
cylinder(h = 120, r = 1.5, center = true);

    translate([166, 66, -15])
    rotate([45, 180, 90])
cylinder(h = 120, r = 1.5, center = true);
}
    
translate([65, 120, 1])
rotate([0, 0, 90])
import("pn532_main.stl", convexity=3);    
    

}


