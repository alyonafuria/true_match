import Principal "mo:base/Principal";
import Array "mo:base/Array";

actor {
  type Claim = {
    id : Text;
    owner : Principal;
    description : Text;
    status : Text;
  };

  stable var claims : [Claim] = [];

  public func addClaim(c : Claim) : async () {
    claims := Array.append<Claim>(claims, [c]);
  };

  public query func getClaimsByUser(p : Principal) : async [Claim] {
    return Array.filter<Claim>(claims, func(c) { c.owner == p });
  };
}
