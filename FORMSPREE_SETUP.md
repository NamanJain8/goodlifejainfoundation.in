# Formspree Setup Instructions

## 1. Create Formspree Account
1. Go to [formspree.io](https://formspree.io)
2. Sign up for a free account
3. Verify your email address

## 2. Create a New Form
1. In your Formspree dashboard, click "New Form"
2. Choose "React" as the integration type
3. Copy the form ID (it will look like "mgvlddkl")

## 3. Update the Form ID
1. Open `src/components/ui/FeedbackModal.tsx`
2. Find line 17: `const [state, handleSubmit] = useForm("mgvlddkl");`
3. Replace "mgvlddkl" with your actual Formspree form ID

## 4. Configure Form Fields (Optional)
In your Formspree dashboard, you can:
- Set up email notifications
- Configure spam protection
- Customize the success message
- Set up webhooks for advanced integrations

## 5. Test the Form
1. Start your development server: `npm run dev`
2. Open the feedback form
3. Submit a test feedback
4. Check your Formspree dashboard for the submission

## Form Fields Being Sent
- `name` - User's name (optional)
- `email` - User's email (optional)  
- `message` - Feedback text (required)
- `rating` - Star rating 1-5 (optional)

## Email Notifications
Formspree will send you an email for each feedback submission with all the form data included.

## Free Tier Limits
- 50 submissions per month
- Basic spam protection
- Email notifications
- Form analytics

For higher limits, upgrade to a paid plan.
