import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

actor {

  // Represents a single work experience
  type Position = {
    company: Text;
    role: Text;
    duration: Nat;
    verified: ?Bool;
    reviewed: ?Bool;
  };

  // Represents a user with parsed positions and metadata
  type User = {
    name: Text;
    skillLevel: Text;
    positions: [Position];
  };

  // Stable storage for upgrade safety
  stable var userEntries: [(Principal, User)] = [];

  // In-memory user database
  let users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);

  // Save to stable var before upgrade
  system func preupgrade() {
    userEntries := Iter.toArray(users.entries());
  };

  // Restore from stable var after upgrade
  system func postupgrade() {
    for ((p, u) in userEntries.vals()) {
      users.put(p, u);
    };
  };

  // Register a new user or update existing user
  public shared(msg) func registerUser(name: Text, skillLevel: Text) : async () {
    let principal = msg.caller;
    let newUser : User = {
      name = name;
      skillLevel = skillLevel;
      positions = [];
    };
    users.put(principal, newUser);
  };

  // Add a new position to a user's record
  public shared(msg) func addPosition(pos: Position) : async () {
    let principal = msg.caller;
    switch (users.get(principal)) {
      case (?user) {
        let updatedUser : User = {
          name = user.name;
          skillLevel = user.skillLevel;
          positions = Array.append<Position>(user.positions, [pos]);
        };
        users.put(principal, updatedUser);
      };
      case null Debug.print("User not found.");
    };
  };

  // Query for caller's profile
  public shared query(msg) func getMyProfile() : async ?User {
    users.get(msg.caller);
  };

  // Verify or review a specific position
  public shared func verifyPosition(target: Principal, index: Nat, field: Text, value: Bool) : async () {
    switch (users.get(target)) {
      case (?user) {
        if (index >= Array.size(user.positions)) return;
        let pos = user.positions[index];
        let updatedPos : Position = {
          company = pos.company;
          role = pos.role;
          duration = pos.duration;
          verified = if (field == "verified") ?value else pos.verified;
          reviewed = if (field == "reviewed") ?value else pos.reviewed;
        };
        let updatedPositions = Array.tabulate<Position>(
          Array.size(user.positions),
          func(i) {
            if (i == index) updatedPos else user.positions[i];
          }
        );
        let updatedUser : User = {
          name = user.name;
          skillLevel = user.skillLevel;
          positions = updatedPositions;
        };
        users.put(target, updatedUser);
      };
      case null return;
    };
  };

  // Return all users
  public query func getAllUsers() : async [(Principal, User)] {
    Iter.toArray(users.entries());
  };
};
