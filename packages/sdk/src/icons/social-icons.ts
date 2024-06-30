const socialIcons = [
  {
    label: "YouTube",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>',
  },
  {
    label: "Twitter/X",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>',
  },
  {
    label: "Instagram",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
  },
  {
    label: "TikTok",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12A4 4 0 1 0 9 20 4 4 0 1 0 9 12z"></path><path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path><path d="M15 8v8c0 1 1 4 4 4"></path></svg>',
  },
  {
    label: "Facebook",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>',
  },
  {
    label: "OnlyFans",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>',
  },
  {
    label: "LinkedIn",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
  },
  {
    label: "Pinterest",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path><path d="M3 12h1m17 0h1M12 3v1m0 17v1m-.5-3.5L9 17m7.5 0L14 20.5M7.5 6.5L4 11m16-4.5L16.5 11"></path></svg>',
  },
  {
    label: "Flickr",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>',
  },
  {
    label: "Reddit",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M15 14a3 3 0 0 1-3 3m-3-3a3 3 0 0 0 3 3"></path><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  },
  {
    label: "Snapchat",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 0-10 10c0 1.8.5 3.5 1.3 5l-1.2 4.7 4.7-1.2c1.5.8 3.2 1.3 5 1.3a10 10 0 0 0 10-10 10 10 0 0 0-10-10z"></path><path d="M8.5 15.5c.8-2.3 2.5-3 3.5-3s2.7.7 3.5 3"></path></svg>',
  },
  {
    label: "Twitch",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path></svg>',
  },
  {
    label: "Discord",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path></svg>',
  },
  {
    label: "WhatsApp",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
  },
  {
    label: "Medium",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>',
  },
  {
    label: "Vimeo",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 18.3 6a9.72 9.72 0 0 1-6.16-2.36A4.48 4.48 0 0 0 12 4v1a4.48 4.48 0 0 0 1.88 3.69A4.48 4.48 0 0 1 15 9.5h1a4.48 4.48 0 0 0 3.69-1.88A9.72 9.72 0 0 1 23 3z"></path></svg>',
  },
  {
    label: "Quora",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>',
  },
  {
    label: "Github",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.4.7-4.1-1.6-4.1-1.6-.5-1.3-1.3-1.6-1.3-1.6-1-.7.1-.7.1-.7 1.2.1 1.8 1.3 1.8 1.3 1 1.8 2.6 1.3 3.2 1 .1-.7.4-1.3.7-1.6-2.7-.3-5.6-1.3-5.6-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.4.1-3 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.7.1 3a4.6 4.6 0 0 1 1.2 3.2c0 4.6-2.9 5.6-5.7 5.9.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A12 12 0 0 0 12 0"></path></svg>',
  },
  {
    label: "GitLab",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="9.9,2 2,22 12,17 22,22 14.1,2"></polygon></svg>',
  },
  {
    label: "Bitbucket",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2H2v20h20V2zM10 20H2v-7.6h8v7.6zm12-3.4h-8v-8h8v8z"></path></svg>',
  },
  {
    label: "Stack Overflow",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16v-2H4v2zM4 17h16v-2H4v2zM8 12h8v2H8v-2zM12 7l4 4-4 4-4-4 4-4z"></path></svg>',
  },
  {
    label: "Behance",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8h4v2h-4z"></path><path d="M16 12h4v2h-4z"></path><path d="M4 2h16v16H4z"></path></svg>',
  },
  {
    label: "Dribbble",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm2.5 3.5C16.5 7.5 18 9 18 9s-1.5 2-2 3.5c-1-1.5-2.5-2.5-4.5-3.5-1-1-2.5-2.5-2.5-2.5s1.5-1 2.5-2c1 0 2.5 1 2.5 1zm-5 0c0 1.5-.5 3-.5 3S6.5 10 6.5 10c0-2 2-3.5 2-3.5zm0 6c.5 1 1 2 1.5 3s.5 1.5 1.5 3-1 3.5-1 3.5 1.5 1 1.5 1 3-2 3-3.5-2-4.5-2-4.5-2 1.5-3.5 0zm8 4.5c-.5-1-1.5-3-3-4s-2-1-3-1 0 0 0 0c-1 0-2 0-3 1-1 1-2 3-2 4 0 1 0 2 1 2 1 0 3 0 4-1 1 0 3 0 4-1z"></path></svg>',
  },
  {
    label: "DeviantArt",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0L2 10h7v4H2l10 10 10-10h-7v-4h7L12 0z"></path></svg>',
  },
  {
    label: "CodePen",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0L2 6l10 6 10-6-10-6zm0 22.5L1.5 16l10-6 10 6-10 6.5zm-10-12L12 0v22L2 10.5zM12 0v22l10-12L12 0z"></path></svg>',
  },
  {
    label: "Dev.to",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0v24h24V0H0zm10.75 18.63c0 .13-.09.27-.27.36-1.34.54-2.74.78-4.25.78C3.36 19.77 2 18.41 2 17V7c0-1.4 1.36-2.77 4.25-2.77 1.5 0 2.91.25 4.25.79.18.09.27.23.27.36v13.25zm3.5-7.5v5.5c0 1.02-.92 2.26-4.02 2.26-1.09 0-2.09-.19-3.02-.55v-10c.93-.36 1.93-.55 3.02-.55 3.1 0 4.02 1.24 4.02 2.26zm6.5 7.5c0 .13-.09.27-.27.36-1.34.54-2.74.78-4.25.78-1.5 0-2.91-.25-4.25-.79-.18-.09-.27-.23-.27-.36V4.88c0-.13.09-.27.27-.36 1.34-.54 2.74-.78 4.25-.78 1.5 0 2.91.25 4.25.78.18.09.27.23.27.36v12.5z"></path></svg>',
  },
  {
    label: "Slack",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 3a1.5 1.5 0 1 1 0 3H10a1.5 1.5 0 0 1 0-3z"></path><path d="M14.5 21a1.5 1.5 0 1 1 0 3H10a1.5 1.5 0 0 1 0-3z"></path><path d="M17 12.5a1.5 1.5 0 1 1 0-3H21a1.5 1.5 0 0 1 0 3z"></path><path d="M7 12.5a1.5 1.5 0 1 1 0-3H11a1.5 1.5 0 0 1 0 3z"></path><path d="M12.5 17a1.5 1.5 0 1 1 3 0V21a1.5 1.5 0 0 1-3 0z"></path><path d="M12.5 7a1.5 1.5 0 1 1 3 0V11a1.5 1.5 0 0 1-3 0z"></path><path d="M7 3a1.5 1.5 0 1 1 3 0V7a1.5 1.5 0 0 1-3 0z"></path><path d="M3 17a1.5 1.5 0 1 1 3 0V21a1.5 1.5 0 0 1-3 0z"></path></svg>',
  },
  {
    label: "Spotify",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 21 3z"></path></svg>',
  },
  {
    label: "SoundCloud",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15.5a3.5 3.5 0 0 0-3.5-3.5H8a4 4 0 0 0 0 8h10a3.5 3.5 0 0 0 3-3.5z"></path><path d="M8 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"></path></svg>',
  },
  {
    label: "Line",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 3A4.5 4.5 0 0 1 23 7.5v9A4.5 4.5 0 0 1 18.5 21h-13A4.5 4.5 0 0 1 1 16.5v-9A4.5 4.5 0 0 1 5.5 3z"></path><path d="M12 17l-3.5 3v-3H8a4.5 4.5 0 0 1 0-9h7a4.5 4.5 0 0 1 0 9h-1.5v3z"></path></svg>',
  },
  {
    label: "KakaoTalk",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 0 0-12 12c0 6.63 9 12 12 12s12-5.37 12-12S18.63 0 12 0zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"></path></svg>',
  },
  {
    label: "Viber",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 15 6v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 21 3z"></path></svg>',
  },
  {
    label: "Periscope",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 0 0-12 12c0 6.63 9 12 12 12s12-5.37 12-12S18.63 0 12 0zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"></path></svg>',
  },
  {
    label: "Mix",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 15 6v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 21 3z"></path></svg>',
  },
  {
    label: "Goodreads",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 3A4.5 4.5 0 0 1 23 7.5v9A4.5 4.5 0 0 1 18.5 21h-13A4.5 4.5 0 0 1 1 16.5v-9A4.5 4.5 0 0 1 5.5 3z"></path><path d="M12 12.5c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z"></path></svg>',
  },
  {
    label: "Patreon",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 3A4.5 4.5 0 0 1 23 7.5v9A4.5 4.5 0 0 1 18.5 21h-13A4.5 4.5 0 0 1 1 16.5v-9A4.5 4.5 0 0 1 5.5 3z"></path><path d="M15 15.5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"></path></svg>',
  },
  {
    label: "PayPal",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>',
  },
  {
    label: "GoFundMe",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12a10 10 0 1 0-10 10A10 10 0 0 0 22 12z"></path><circle cx="12" cy="12" r="3"></circle><line x1="2" y1="2" x2="22" y2="22"></line></svg>',
  },
  {
    label: "OpenCollective",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20z"></path></svg>',
  },
  {
    label: "Ko-fi",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 10h8l1 6H7l1-6zM9 6h6v4H9V6z"></path></svg>',
  },
  {
    label: "Buy Me a Coffee",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8H4v12h16V8zm0 0H4l-2 2h20l-2-2z"></path><path d="M8 18h8v4H8v-4z"></path></svg>',
  },
  {
    label: "Liberapay",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M15 9a3 3 0 0 0-6 0 3 3 0 0 0 6 0z"></path><path d="M9 9a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0V9z"></path></svg>',
  },
  {
    label: "Gratipay",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6a6 6 0 0 0 0 12 6 6 0 0 0 0-12z"></path></svg>',
  },
  {
    label: "BountySource",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M15 9a3 3 0 0 0-6 0 3 3 0 0 0 6 0z"></path><path d="M9 9a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0V9z"></path></svg>',
  },
  {
    label: "Tidelift",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6V2h-2v4H7l5 6h4v4h2v-4h-3l5-6h-4V2h-2v4h-2z"></path><path d="M12 12h4l-4 4h-4l4-4z"></path></svg>',
  },
  {
    label: "Indiegogo",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>',
  },
  {
    label: "Kickstarter",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>',
  },
  {
    label: "JustGiving",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 0 0-12 12c0 6.63 9 12 12 12s12-5.37 12-12S18.63 0 12 0zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"></path></svg>',
  },
  {
    label: "Donorbox",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 0 0-12 12c0 6.63 9 12 12 12s12-5.37 12-12S18.63 0 12 0zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"></path></svg>',
  },
  {
    label: "Tiltify",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>',
  },
  {
    label: "GlobalGiving",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12a10 10 0 1 0-10 10A10 10 0 0 0 22 12z"></path><circle cx="12" cy="12" r="3"></circle><line x1="2" y1="2" x2="22" y2="22"></line></svg>',
  },
  {
    label: "Network for Good",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 3A4.5 4.5 0 0 1 23 7.5v9A4.5 4.5 0 0 1 18.5 21h-13A4.5 4.5 0 0 1 1 16.5v-9A4.5 4.5 0 0 1 5.5 3z"></path><path d="M12 12.5c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z"></path></svg>',
  },
  {
    label: "Fundly",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>',
  },
  {
    label: "FundRazr",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>',
  },
  {
    label: "GiveLively",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>',
  },
  {
    label: "Causes",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 0 0-12 12c0 6.63 9 12 12 12s12-5.37 12-12S18.63 0 12 0zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"></path></svg>',
  },
  {
    label: "Clubhouse",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 3A4.5 4.5 0 0 1 23 7.5v9A4.5 4.5 0 0 1 18.5 21h-13A4.5 4.5 0 0 1 1 16.5v-9A4.5 4.5 0 0 1 5.5 3z"></path><path d="M12 8.5c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z"></path></svg>',
  },
  {
    label: "Mastodon",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 0 0-12 12c0 6.63 9 12 12 12s12-5.37 12-12S18.63 0 12 0zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"></path></svg>',
  },
  {
    label: "ManyVids",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>',
  },
  {
    label: "JustForFans",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2H3v20h18V2zM16 12.3C16 15.4 13.4 18 10.3 18 7.2 18 4.7 15.4 4.7 12.3 4.7 9.2 7.2 6.6 10.3 6.6 13.4 6.6 16 9.2 16 12.3z"></path><path d="M12 4V0"></path></svg>',
  },
  {
    label: "QQ",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm0 22a10 10 0 1 1 10-10A10 10 0 0 1 12 22z"></path><path d="M12 5a7 7 0 1 1-7 7 7 7 0 0 1 7-7m0-1A8 8 0 1 0 20 12 8 8 0 0 0 12 4z"></path></svg>',
  },
  {
    label: "Weibo",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm0 22a10 10 0 1 1 10-10A10 10 0 0 1 12 22z"></path><path d="M12 5a7 7 0 1 1-7 7 7 7 0 0 1 7-7m0-1A8 8 0 1 0 20 12 8 8 0 0 0 12 4z"></path></svg>',
  },
  {
    label: "Qzone",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm0 22a10 10 0 1 1 10-10A10 10 0 0 1 12 22z"></path><path d="M12 5a7 7 0 1 1-7 7 7 7 0 0 1 7-7m0-1A8 8 0 1 0 20 12 8 8 0 0 0 12 4z"></path></svg>',
  },
  {
    label: "Sina Weibo",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm0 22a10 10 0 1 1 10-10A10 10 0 0 1 12 22z"></path><path d="M12 5a7 7 0 1 1-7 7 7 7 0 0 1 7-7m0-1A8 8 0 1 0 20 12 8 8 0 0 0 12 4z"></path></svg>',
  },
  {
    label: "Douyin",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2H3v20h18V2zm-7 14c-1 0-1.75.75-1.75 1.75S13 19.5 14 19.5s1.75-.75 1.75-1.75S15 16 14 16z"></path><path d="M10 2v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V2h10z"></path></svg>',
  },
  {
    label: "Kuaishou",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2H3v20h18V2zm-7 14c-1 0-1.75.75-1.75 1.75S13 19.5 14 19.5s1.75-.75 1.75-1.75S15 16 14 16z"></path><path d="M10 2v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V2h10z"></path></svg>',
  },
  {
    label: "Baidu Tieba",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm0 22a10 10 0 1 1 10-10A10 10 0 0 1 12 22z"></path><path d="M12 5a7 7 0 1 1-7 7 7 7 0 0 1 7-7m0-1A8 8 0 1 0 20 12 8 8 0 0 0 12 4z"></path></svg>',
  },
  {
    label: "Nextdoor",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10V6c0-1.1-.9-2-2-2h-1V3a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H5c-1.1 0-2 .9-2 2v4H1v11a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10h-2zm-1 11H4v-9h16v9zm-9-8h-2v6h2v-6zm4 0h-2v6h2v-6zm-8 0H7v6h2v-6z"></path></svg>',
  },
  {
    label: "Parler",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.9 8.6c.4-1.4.6-2.9.6-4.5 0-2.8-1-5.3-2.7-7.2-1.7-1.9-4-2.9-6.6-2.9s-5 .9-6.6 2.8c-1.7 1.9-2.7 4.4-2.7 7.2 0 1.6.2 3.1.6 4.5L.1 14.9v6.8L3.7 24H7v-6.9L4.2 14.6zM8 19v5H5.3l-1.7-1.6V15l2.7 2.7zm-1.6-7c-1.1-.9-1.8-2.2-1.8-3.8 0-2.8 1.5-5.1 3.5-5.1s3.5 2.3 3.5 5.1c0 1.6-.7 2.9-1.8 3.8l1.6 1.4c1.4-1.2 2.3-3 2.3-5.2 0-3.7-2.1-6.8-4.6-6.8S5.4 7.3 5.4 11c0 2.1.9 4 2.3 5.2z"></path></svg>',
  },
  {
    label: "Gab",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>',
  },
  {
    label: "MeWe",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 3A4.5 4.5 0 0 1 23 7.5v9A4.5 4.5 0 0 1 18.5 21h-13A4.5 4.5 0 0 1 1 16.5v-9A4.5 4.5 0 0 1 5.5 3z"></path><path d="M12 12.5c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z"></path></svg>',
  },
  {
    label: "Vero",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 13.6l-4.2-4.2-4.2 4.2H12l4.2-4.2 4.2 4.2h-4.2z"></path></svg>',
  },
  {
    label: "Ello",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M14.31 14.31a4 4 0 0 1-5.62 0"></path></svg>',
  },
  {
    label: "Threads",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20"></path><path d="M2 12h20"></path></svg>',
  },
  {
    label: "Anchor",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a1 1 0 0 1 1 1v1h-2V3a1 1 0 0 1 1-1z"></path><path d="M5 8a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z"></path><path d="M18 8a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z"></path><path d="M9 21a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h-6v-1z"></path><path d="M12 12a2 2 0 1 1-2-2 2 2 0 0 1 2 2z"></path><path d="M19 21h-1v-6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6H5"></path></svg>',
  },
  {
    label: "Substack",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08c0 .6-.41 1.11-.99 1.25a1.64 1.64 0 0 1-.71.02c-.6-.11-1.12-.61-1.19-1.23-.03-.28.02-.56.17-.8a1.15 1.15 0 0 1 1.73-.26c.28.25.44.6.44.98v0h0z"></path><path d="M2 9h20v12H2z"></path><path d="M5 6h14v3H5z"></path><path d="M5 3h14v3H5z"></path></svg>',
  },
];
