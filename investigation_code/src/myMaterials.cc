//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// myMaterials.cc
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#include "G4Isotope.hh"
#include "G4Element.hh"
#include "G4NistManager.hh"
#include "G4SystemOfUnits.hh"

#include "myMaterials.hh"

myMaterials::myMaterials() {
  DefineMaterials();
}

myMaterials::~myMaterials() {}

G4Material* myMaterials::GetVacuum() {
  return Vacuum;
}

G4Material* myMaterials::GetLi6ZnS() {
  return Li6_ZnS;
}

void myMaterials::DefineMaterials() {
  // Vacuum
  G4double atomicNumber = 1.;
  G4double massOfMole = 1.008*g/mole;
  G4double density = 1.e-25*g/cm3;
  G4double temperature = 2.73*kelvin;
  G4double pressure = 3.e-18*pascal;
  Vacuum = new G4Material("interGalactic", atomicNumber, massOfMole, density, kStateGas, temperature, pressure);/* https://www-jlc.kek.jp/~hoshina/geant4/Geant4Lecture2003/2-2a.html#7 */

  // Li-6
  G4Isotope* isotopeLi6 = new G4Isotope("Li6", 3, 6, 6.015*g/mole);
  G4Element* elementLi6 = new G4Element("Lithium6", "li6", 1);
  elementLi6->AddIsotope(isotopeLi6, 100.*perCent);
  G4Material* Li6 = new G4Material("Li6", 0.534*g/cm3, 1);
  Li6->AddElement(elementLi6, 100.*perCent);

  // ZnS
  G4Element* elementZn = G4NistManager::Instance()->FindOrBuildElement("Zn");
  G4Element* elementS = G4NistManager::Instance()->FindOrBuildElement("S");
  G4Material* ZnS = new G4Material("ZnS", 4.1*g/cm3, 2);
  ZnS->AddElement(elementZn, 1);
  ZnS->AddElement(elementS, 1);

  // Li-6とZnSの混合材料(比は変更可能)
  Li6_ZnS = new G4Material("Li6_ZnS", 3.3*g/cm3, 2);
  Li6_ZnS->AddMaterial(ZnS, 90*perCent);
  Li6_ZnS->AddMaterial(Li6, 10*perCent);
}