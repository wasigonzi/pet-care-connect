# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img "GestionVet" [ref=e6]
      - paragraph [ref=e7]: Enter your credentials to access the platform
    - generic [ref=e8]:
      - generic [ref=e11]:
        - generic [ref=e12]:
          - text: Email
          - textbox "Email" [ref=e13]:
            - /placeholder: m@example.com
        - generic [ref=e14]:
          - generic [ref=e16]: Password
          - textbox "Password" [ref=e17]
        - button "Sign in" [ref=e18] [cursor=pointer]
      - generic [ref=e19]: "Demo: admin@petcare.com / password"
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e25] [cursor=pointer]:
    - img [ref=e26]
  - alert [ref=e29]
```