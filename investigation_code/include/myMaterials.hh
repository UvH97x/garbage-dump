//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// myMaterials.hh
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#ifndef myMaterials_hh
#define myMaterials_hh 1

#include "G4NistManager.hh"
#include "G4Material.hh"
#include "G4SystemOfUnits.hh"

class myMaterials {
  public:
    myMaterials();
    ~myMaterials();
    G4Material* GetVacuum();
    G4Material* GetLi6ZnS();

  private:
    G4Material* Vacuum;
    G4Material* Li6_ZnS;
    void DefineMaterials();
};
#endif