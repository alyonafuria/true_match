import Principal "mo:base/Principal";
import Array "mo:base/Array";

actor {
  stable var users : [(Principal, Text, Text)] = [];

  public func registerUser(p : Principal, linkedinId : Text, email : Text) : async () {
    users := Array.append<(Principal, Text, Text)>(users, [(p, linkedinId, email)]);
  };

  public query func getUsers() : async [(Principal, Text, Text)] {
    return users;
  };
}
