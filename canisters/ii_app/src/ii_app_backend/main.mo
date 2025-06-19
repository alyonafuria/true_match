import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";

actor {
  // HTTP interface types
  private module HttpTypes = {
    public type HeaderField = (Text, Text);
    public type HttpRequest = {
      method : Text;
      url : Text;
      headers : [HeaderField];
      body : Blob;
    };
    public type HttpResponse = {
      status_code : Nat16;
      headers : [HeaderField];
      body : Blob;
      streaming_strategy: ?StreamingStrategy;
    };
    public type StreamingStrategy = {
      #Callback: {
        callback : StreamingCallback;
        token    : StreamingCallbackToken;
      };
    };
    public type StreamingCallback = query (StreamingCallbackToken) -> async (StreamingCallbackResponse);
    public type StreamingCallbackToken =  {
      content_encoding : Text;
      index : Nat;
      key : Text;
      sha256: ?[Nat8];
    };
    public type StreamingCallbackResponse = {
      body  : Blob;
      token : ?StreamingCallbackToken;
    };
  };
  // HTTP request handler
  public query func http_request(req : HttpTypes.HttpRequest) : async HttpTypes.HttpResponse {
    // Simple response for all requests
    {
      status_code = 200;
      headers = [("Content-Type", "text/plain; charset=utf-8")];
      body = Text.encodeUtf8("Hello from your canister!");
      streaming_strategy = null;
    }
  };

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
