# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - heading "Pet Care Connect" [level=1] [ref=e5]
      - paragraph [ref=e6]: Enter your credentials to access the platform
    - generic [ref=e7]:
      - generic [ref=e10]:
        - generic [ref=e11]:
          - text: Email
          - textbox "Email" [ref=e12]:
            - /placeholder: m@example.com
        - generic [ref=e13]:
          - generic [ref=e15]: Password
          - textbox "Password" [ref=e16]
        - button "Sign in" [ref=e17] [cursor=pointer]
      - generic [ref=e18]: "Demo: admin@petcare.com / password"
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e24] [cursor=pointer]:
    - img [ref=e25]
  - alert [ref=e28]
```