(function () {
  console.log("script has started running.");
  function countOccurences(string, split_by) {
    return string.split(split_by).length - 1;
  }

  function categorize_sub_domain(hostname) {
    let no_of_dots = countOccurences(hostname, ".") - 1;
    let sub_multi_categorixation;
    if (no_of_dots == 1) {
      sub_multi_categorixation = "legitimate";
    }
    if (no_of_dots == 2) {
      sub_multi_categorixation = "suspicious";
    }
    if (no_of_dots >= 3) {
      sub_multi_categorixation = "phishing";
    }
    return sub_multi_categorixation;
  }
  function hasIpAddress(url) {
    let ipv4Url = RegExp(
      [
        "^https?://([a-z0-9\\.\\-_%]+:([a-z0-9\\.\\-_%])+?@)?",
        "((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4",
        "][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])?",
        "(:[0-9]+)?(/[^\\s]*)?$",
      ].join(""),
      "i"
    );
    if (ipv4Url.test(url)) {
      return 1;
    }
    return 0;
  }

  function form_contains_mailto(){
    let submit_email = 0
    let forms = document.forms
    for (let i = 0; i < forms.length; i++ ){
      let form = forms[i] // js returns index
      let includes_mailto = form.action.includes("mailto:")
      let includes_mail = form.action.includes("mail()") // form contains whatsaapp wa.
      if (includes_mailto || includes_mail){
        submit_email = 1
        return submit_email
      }
    }
    return submit_email
  }

  function getCountOfDigits(url) {
    return url.replace(/[^0-9]/g, '').length;
  }
  function getUrlFeatures() {
    // remeber to use promise.resove all or something ute .
    let url = document.URL;
    let ip = hasIpAddress(url)
    let length_url = url.length;
    let is_url_long = length_url > 52; // bool
    let url_slash_count = countOccurences(url, "//"); // url slashes
    let url_contains_at_symbol = url.includes("@"); // bool
    let urlParts = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(url);
    let hostname = urlParts[1]; // www.example.com
    let length_hostname = hostname.length;
    let url_contains_dash_symbol = hostname.includes("-"); // bool
    let sub_multi_categorixation = categorize_sub_domain(hostname); // returns one of three categories
    // uses https .....
    let https_token = url.startsWith("https://") ? 0 : 1
    // is https in domain
    let is_https_in_domain = hostname.includes("https");
    let nb_subdomains = countOccurences(url, ".");
    let nb_hyphens = countOccurences(url, "-");
    let nb_at = countOccurences(url, "@");
    let nb_dollar = countOccurences(url, "$");
    let nb_semicolumn = countOccurences(url, ";");
    let nb_comma = countOccurences(url, ",");
    let nb_star = countOccurences(url, "*");
    let nb_percent = countOccurences(url, "%");
    let nb_slash = countOccurences(url, "/");
    let nb_colon = countOccurences(url, ":");
    let http_in_path = countOccurences(url, "http");
    let ratio_digits_url = getCountOfDigits(url) / length_url
    let ratio_digits_host = getCountOfDigits(hostname) / hostname.length
    let url_features = {
      ip, 
      length_url,
      nb_subdomains,
      nb_hyphens,
      nb_at,
      nb_dollar,
      nb_semicolumn,
      nb_comma,
      nb_colon,
      nb_star,
      nb_slash,
      http_in_path,
      nb_percent, 
      https_token,
      ratio_digits_url, 
      ratio_digits_host,


    };
    return url_features;
  }
  let url_f = getUrlFeatures();
  function popupwindow(){
    scripts = document.scripts
    for (let i = 0; i < scripts.length; i++){
      script = scripts[i]
      script = script.outerHTML
      console.log(script)
      if (script.toLowerCase().includes("prompt(")){
        return 1
      }
    }    
    return 0
  }
  function rightclick(){
    scripts = document.scripts
    for (let i = 0; i < scripts.length; i++){
      script = scripts[i]
      script = script.outerHTML
      console.log(script)
      if (script.toLowerCase().includes("contextmenu") && script.toLowerCase().includes("preventdefault")){
        return 1
      }
    }
    return 0
  }

  function get_content_features(){
    let nb_hyperlinks = document.querySelectorAll('[src],[href]').length
    let submit_email = form_contains_mailto()
    let empty_title = document.title ? 0 : 1
    let hostname =  window.location.hostname.toLowerCase()
    let title = document.title.toLowerCase()
    let domain_in_title = title.includes(hostname)  ? 0 : 1;
    let right_clic = rightclick()
    let popup_window = popupwindow()
    let content_features  =  {
      nb_hyperlinks, 
      submit_email,
      empty_title, 
      domain_in_title,
      right_clic,
      popup_window,
    }

    return content_features
  }
  let content_features = get_content_features()

  let all_features = {
    ...url_f,
    ...content_features,
  }

  // // Send to the background script .... / service worker
  chrome.runtime.sendMessage({ msg: "Features", data: all_features }, (response) => {
    // If this message's recipient sends a response it will be handled here
    if (response) {
      // handle the response of the ml
      console.log(response);
    }
  });

  // send these to the background script
})();
