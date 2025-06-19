import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";

actor {
  // LinkedIn ID → Principal map
  let map = HashMap.HashMap<Text, Principal>(10, Text.equal, Text.hash);

  public func linkIdentity(linkedinId : Text, principal : Principal) : async Bool {
    map.put(linkedinId, principal);
    return true;
  };

  public func getPrincipal(linkedinId : Text) : async ?Principal {
    return map.get(linkedinId);
  };
}
