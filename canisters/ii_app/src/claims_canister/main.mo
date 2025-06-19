import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";
import UUID "mo:uuid/async/UUID";

actor {
  public type ClaimStatus = {
    #pending;    // Waiting for verification
    #verified;   // Successfully verified
    #rejected;   // Verification failed
    #in_progress; // Verification in progress
  };

  public type WorkExperience = {
    title : Text;
    company : Text;
    startDate : Text;
    endDate : ?Text; // Null means "present"
    description : ?Text;
  };

  public type Verifier = {
    id : Text;      // e.g., "google"
    name : Text;    // e.g., "Google Workspace"
    verifiedAt : ?Int; // When verification was completed
  };

  public type Claim = {
    id : Text;
    owner : Principal;  // User who created the claim
    workExperience : WorkExperience;
    status : ClaimStatus;
    verifier : Verifier;
    createdAt : Int;    // When claim was created
    updatedAt : Int;    // Last update time
  };

  stable var claims : [Claim] = [];

  // Default verifiers
  let GOOGLE_VERIFIER : Verifier = {
    id = "google";
    name = "Google Workspace";
    verifiedAt = null;
  };

  // Create a new work experience claim with Google as verifier
  public shared ({ caller }) func createWorkExperienceClaim(exp : WorkExperience) : async Claim {
    let claimId = await UUID.UUID.V4();
    let now = Time.now();
    
    let newClaim : Claim = {
      id = claimId;
      owner = caller;
      workExperience = exp;
      status = #in_progress; // Start verification process
      verifier = {
        GOOGLE_VERIFIER with
        verifiedAt = null
      };
      createdAt = now;
      updatedAt = now;
    };

    claims := Array.append<Claim>(claims, [newClaim]);
    
    // In a real app, you would start the verification process here
    // For now, we'll simulate it with a timer
    ignore do ? {
      await startVerificationProcess(claimId, caller);
    };
    
    newClaim
  };

  // Start the verification process (simulated)
  private func startVerificationProcess(claimId : Text, owner : Principal) : async () {
    // Simulate verification delay (5 seconds)
    await* async {
      ignore await Timer.setTimer(#seconds 5);
      
      // Update claim status to pending (verification in progress)
      await updateClaimStatus(claimId, owner, #pending);
    };
  };

  // Update claim status (internal)
  private func updateClaimStatus(claimId : Text, owner : Principal, status : ClaimStatus) : async ?Claim {
    let now = Time.now();
    
    switch (Array.find<Claim>(claims, func(c) { c.id == claimId and c.owner == owner })) {
      case (null) { null };
      case (?claim) {
        let updatedClaim = {
          claim with
          status = status;
          updatedAt = now;
          verifier = {
            claim.verifier with
            verifiedAt = if (status == #verified) ?now else claim.verifier.verifiedAt
          };
        };
        
        claims := Array.map<Claim, Claim>(
          claims,
          func(c) { if (c.id == claimId) updatedClaim else c }
        );
        ?updatedClaim
      };
    }
  };

  // Batch create multiple work experience claims
  public shared ({ caller }) func batchCreateWorkExperienceClaims(experiences : [WorkExperience]) : async [Claim] {
    var newClaims : [Claim] = [];
    
    for (exp in experiences.vals()) {
      let claim = await createWorkExperienceClaim(exp);
      newClaims := Array.append<Claim>(newClaims, [claim]);
    };
    
    newClaims
  };

  // Get all claims for the calling user
  public shared query ({ caller }) func getMyClaims() : async [Claim] {
    Array.filter<Claim>(claims, func(c) { c.owner == caller })
  };

  // Get a specific claim by ID (owner only)
  public shared query ({ caller }) func getClaim(claimId : Text) : async ?Claim {
    switch (Array.find<Claim>(claims, func(c) { c.id == claimId and c.owner == caller })) {
      case (null) { null };
      case (?claim) { ?claim };
    }
  };

  // Complete verification (would be called by verifier service)
  public shared ({ caller }) func completeVerification(claimId : Text, verified : Bool) : async ?Claim {
    // In a real app, verify the caller is the verifier service
    let now = Time.now();
    
    switch (Array.find<Claim>(claims, func(c) { c.id == claimId })) {
      case (null) { null };
      case (?claim) {
        let status : ClaimStatus = if (verified) #verified else #rejected;
        let updatedClaim = {
          claim with
          status = status;
          updatedAt = now;
          verifier = {
            claim.verifier with
            verifiedAt = ?now
          };
        };
        
        claims := Array.map<Claim, Claim>(
          claims,
          func(c) { if (c.id == claimId) updatedClaim else c }
        );
        ?updatedClaim
      };
    }
  };

  // For testing: simulate verification result
  public shared ({ caller }) func simulateVerification(claimId : Text, verified : Bool) : async ?Claim {
    await completeVerification(claimId, verified);
  };
}
