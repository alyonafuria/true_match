import Array "mo:base/Array";

actor {
  type Verification = {
    claimId : Text;
    verifiedBy : Text;
    status : Text;
    timestamp : Int;
  };

  stable var verifications : [Verification] = [];

  public func verifyClaim(claimId : Text, verifiedBy : Text, status : Text, timestamp : Int) : async () {
    let v : Verification = {
      claimId = claimId;
      verifiedBy = verifiedBy;
      status = status;
      timestamp = timestamp;
    };
    verifications := Array.append<Verification>(verifications, [v]);
  };

  public query func getVerifications() : async [Verification] {
    return verifications;
  };
}
