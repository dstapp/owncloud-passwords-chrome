# ownCloud Passwords Extension for Chrome/Chromium

**DISCLAIMER:** This app is work in progress and not yet tested regarding security concerns. Use on your own risk.

**IMPORTANT:** Only connect to ownCloud instances that run fully on HTTP**S**. Otherwise all your passwords will be
transfered in clear-text.

This is a working version of a ownCloud Passwords extension for Chrome/Chromium. It fetches passwords stored in
ownCloud Passwords and fills the login forms. It also supports creating new passwords through the provided UI.

## How it works

When you click the lock icon in your toolbar, the Extension will request all your Passwords and match them against the
URL of your currently active tab by comparing the domain. So if you're currently on Stack Overflow, your Domain is
"stackoverflow.com" (always without "www."). This has to be the content of the "Website" (not "full URL"!) field
of your password entry in ownCloud passwords. Then it will show up

## Compatibility

Tested in Chromium 54.

## Installation

1. Check out the extension
2. Go to "Extensions" in your Chrome settings
3. Enable developer mode
4. "Load unpacked extension"
5. Select your checkout root
6. Go to options and configure your ownCloud connection

## Bug reports

Please let me know about any bugs you encounter.

## Help wanted

I'm searching for bug reports, code contributions, beta testers and code reviewers. Please let me know, if you want to help.
