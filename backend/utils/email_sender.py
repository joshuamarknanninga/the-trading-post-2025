# backend/utils/email_sender.py

import os
import smtplib
from threading import Thread
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import current_app

# -----------------------------------------------------------------------------
# Configuration from environment variables
# -----------------------------------------------------------------------------
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.example.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USERNAME = os.environ.get('SMTP_USERNAME', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
SMTP_USE_TLS = os.environ.get('SMTP_USE_TLS', 'True').lower() in ('true', '1', 'yes')
DEFAULT_SENDER = os.environ.get('DEFAULT_SENDER', SMTP_USERNAME)


def _send_via_smtp(message: MIMEMultipart):
    """
    Internal helper to send an email message via SMTP.
    """
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
    try:
        server.ehlo()
        if SMTP_USE_TLS:
            server.starttls()
            server.ehlo()
        if SMTP_USERNAME and SMTP_PASSWORD:
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(message)
    finally:
        server.quit()


def send_email(to_address: str,
               subject: str,
               text_body: str,
               html_body: str = None,
               sender: str = None):
    """
    Sends an email to `to_address` with given subject and body.
    - text_body: plain-text version of the email.
    - html_body: optional HTML version; if provided, email will be multipart/alternative.
    - sender: override default FROM address.

    This dispatches the email asynchronously in a background thread.
    """
    from_addr = sender or DEFAULT_SENDER
    msg = MIMEMultipart('alternative') if html_body else MIMEMultipart()
    msg['Subject'] = subject
    msg['From'] = from_addr
    msg['To'] = to_address

    # Attach the plain-text part
    part_text = MIMEText(text_body, 'plain')
    msg.attach(part_text)

    # Attach the HTML part, if provided
    if html_body:
        part_html = MIMEText(html_body, 'html')
        msg.attach(part_html)

    # Send asynchronously so as not to block request handling
    thread = Thread(target=_send_via_smtp, args=(msg,))
    thread.daemon = True
    thread.start()
    current_app.logger.debug(f"Dispatched email to {to_address} with subject '{subject}'")
