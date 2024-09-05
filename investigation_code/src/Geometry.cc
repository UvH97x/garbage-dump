//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Geometry.cc
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#include "Geometry.hh"
#include "G4Box.hh"
#include "G4Tubs.hh"
#include "G4UniformMagField.hh"
#include "G4FieldManager.hh"
#include "G4LogicalVolume.hh"
#include "G4PVPlacement.hh"
#include "G4VPhysicalVolume.hh"
#include "G4ThreeVector.hh"
#include "G4RotationMatrix.hh"
#include "G4Transform3D.hh"
#include "G4NistManager.hh"
#include "G4VisAttributes.hh"
#include "G4SystemOfUnits.hh"

#include "myMaterials.hh"

//------------------------------------------------------------------------------
  Geometry::Geometry() {}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
  Geometry::~Geometry() {}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
  G4VPhysicalVolume* Geometry::Construct()
//------------------------------------------------------------------------------
{
// Get the pointer to 'Material Manager'
   G4NistManager* materi_Man = G4NistManager::Instance();
   myMaterials* myMateri = new myMaterials();

// Define 'World Volume'
   // Define the shape of solid
   G4double leng_X_World = 2.0*m;           // X-full-length of world
   G4double leng_Y_World = 2.0*m;           // Y-full-length of world
   G4double leng_Z_World = 2.0*m;           // Z-full-length of world
   auto solid_World =
     new G4Box{ "Solid_World", leng_X_World/2.0, leng_Y_World/2.0, leng_Z_World/2.0 };

   // Define the logical volume
   G4Material* Vacuum = myMateri->GetVacuum();
   G4Material* materi_World = materi_Man->FindOrBuildMaterial( "G4_AIR" );
   auto logVol_World = new G4LogicalVolume{ solid_World, Vacuum, "LogVol_World" };
   logVol_World->SetVisAttributes ( G4VisAttributes::GetInvisible() );

// Define 'Solenoid Coil'
   // Define the shape of solid
   // 円筒状の空気に一様磁場をかけて疑似的なソレノイドコイルとする。
   G4double radius_Solenoid = 5.0*mm;
   G4double leng_Solenoid = 108*mm;
   auto solid_Solenoid = new G4Tubs{ "Solid_Solenoid", 0, radius_Solenoid, leng_Solenoid/2.0, 0.*deg, 360.*deg };
   // Define the uniform Magnetic Field
   G4ThreeVector magneticFieldVector(0., 1.*tesla, 0.);
   G4UniformMagField* magField_Solenoid = new G4UniformMagField(magneticFieldVector);
   G4FieldManager* fieldMan_Solenoid = new G4FieldManager(magField_Solenoid);

   // Define the logical volume
   G4Material* materi_Solenoid = materi_Man->FindOrBuildMaterial( "G4_AIR" );
   auto logVol_Solenoid = new G4LogicalVolume{ solid_Solenoid, Vacuum, "LogVol_Solenoid" };
   logVol_Solenoid->SetFieldManager(fieldMan_Solenoid, true);

// Define 'Screen Detector'
   // Define the shape of solid
   G4double leng_X_Screen = 15*mm;
   G4double leng_Y_Screen = 40*mm;
   G4double thick_Screen = 0.4*mm;
   auto solid_Screen = new G4Box{ "Solid_Screen", leng_X_Screen, leng_Y_Screen, thick_Screen};

   // Define the logical volume
   G4Material* materi_Screen = myMateri->GetLi6ZnS();
   auto logVol_Screen = new G4LogicalVolume{ solid_Screen, materi_Screen, "LogVol_Screen" };


// Placement of 'World Volume'
   G4int copyNum_World = 0;                 // Set ID number of world
   auto physVol_World  = new G4PVPlacement{ G4Transform3D(), "PhysVol_World",
                                           logVol_World, 0, false, copyNum_World };

// Install Objects to World Volume
   // Install Solenoid Coil
   G4double pos_X_Solenoid = 0.0*cm;
   G4double pos_Y_Solenoid = 0.0*cm;
   G4double pos_Z_Solenoid = 0.0*cm;
   auto threeVect_Solenoid = G4ThreeVector{ pos_X_Solenoid, pos_Y_Solenoid, pos_Z_Solenoid };
   auto rotMtrx_Solenoid = G4RotationMatrix{};
   auto trans3D_Solenoid = G4Transform3D{ rotMtrx_Solenoid, threeVect_Solenoid };
   G4int copyNum_Solenoid = 1000;
   new G4PVPlacement{ trans3D_Solenoid, "PhysVol_Solenoid", logVol_Solenoid, physVol_World, false, copyNum_Solenoid, true };

   // Install Screen Detector
   G4double pos_X_Screen = 0.0*cm;
   G4double pos_Y_Screen = 0.0*cm;
   G4double pos_Z_Screen = 50.0*cm;
   auto threeVect_Screen = G4ThreeVector{ pos_X_Screen, pos_Y_Screen, pos_Z_Screen };
   auto rotMtrx_Screen = G4RotationMatrix{};
   auto trans3D_Screen = G4Transform3D{ rotMtrx_Screen, threeVect_Screen };
   G4int copyNum_Screen = 2000;
   new G4PVPlacement{ trans3D_Screen, "PhysVol_Screen", logVol_Screen, physVol_World, false, copyNum_Screen, true };
   

// Return the physical volume of 'World'
   return physVol_World;
}
