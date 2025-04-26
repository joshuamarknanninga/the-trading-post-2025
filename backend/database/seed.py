# backend/database/seed.py

from server.app import app
from flask_sqlalchemy import SQLAlchemy
from models.user import User
from models.item import Item
from models.trade_history import TradeHistory
from models.badges import Badge
from models.chat import ChatMessage
from models.event import Event
from models.meetup import Meetup
from models.referral import Referral
from models.forum import ForumPost, ForumReply
from models.reports import Report
from models.wallet import Wallet, Transaction
from models.spirit_animal import SpiritAnimal
from models.trade_wrapped import TradingWrapped

# Initialize SQLAlchemy with our Flask app
db = SQLAlchemy(app)

def seed():
    with app.app_context():
        # Drop and recreate all tables
        db.drop_all()
        db.create_all()

        # --- Users ---
        alice = User(
            full_name="Alice Johnson",
            email="alice@example.com",
            password_hash=User.hash_password("password123"),
            address="123 Maple St, Springfield",
            latitude=39.799017,
            longitude=-89.643957,
            role="user"
        )
        bob = User(
            full_name="Bob Smith",
            email="bob@example.com",
            password_hash=User.hash_password("securepass"),
            address="456 Oak Ave, Springfield",
            latitude=39.806017,
            longitude=-89.650957,
            role="user"
        )
        db.session.add_all([alice, bob])
        db.session.flush()  # ensure ids are assigned

        # --- Items ---
        item1 = Item(
            title="Vintage Guitar",
            description="1960s acoustic guitar in good condition",
            owner_id=alice.id,
            latitude=alice.latitude,
            longitude=alice.longitude,
            category="instruments",
            price=250.00,
            currency_type="usd",
            icon="/icons/instruments.png"
        )
        item2 = Item(
            title="Handmade Pottery Vase",
            description="Beautiful ceramic vase, barter welcome",
            owner_id=bob.id,
            latitude=bob.latitude,
            longitude=bob.longitude,
            category="home",
            price=None,
            currency_type="barter",
            icon="/icons/home.png"
        )
        db.session.add_all([item1, item2])

        # --- Wallets & Transactions ---
        w1 = Wallet(user_id=alice.id, tokens=100, crypto_balance=0.05)
        w2 = Wallet(user_id=bob.id, tokens=50, crypto_balance=0.00)
        db.session.add_all([w1, w2])
        tx1 = Transaction(wallet_id=w1.id, type="earn", amount=20, currency="token", description="Welcome bonus")
        tx2 = Transaction(wallet_id=w2.id, type="earn", amount=10, currency="token", description="Referral bonus")
        db.session.add_all([tx1, tx2])

        # --- Badges ---
        b1 = Badge(title="First Trade", description="Complete your first trade.", icon="⭐", color="bg-yellow-400")
        b2 = Badge(title="Barter Master", description="Complete 10 barter trades.", icon="🔁", color="bg-green-400")
        db.session.add_all([b1, b2])

        # --- Spirit Animals ---
        sa1 = SpiritAnimal(user_id=alice.id, animal="Fox")
        sa2 = SpiritAnimal(user_id=bob.id, animal="Owl")
        db.session.add_all([sa1, sa2])

        # --- Forum ---
        post = ForumPost(author_id=alice.id, title="Best Barter Tips?", content="What’s your advice for a first barter?")
        reply = ForumReply(post_id=post.id, author_id=bob.id, content="Always meet in a public place!")
        db.session.add_all([post, reply])

        # --- Events & Meetups ---
        event = Event(
            title="Spring Swap Meet",
            description="Community swap meet at the park.",
            date="2025-05-15",
            time="10:00",
            location_name="Central Park Pavilion",
            location_lat=39.800000,
            location_lng=-89.650000
        )
        db.session.add(event)
        meetup = Meetup(user_id=alice.id, event_id=event.id, status="attending")
        db.session.add(meetup)

        # --- Referrals ---
        ref = Referral(referrer_id=alice.id, referee_id=bob.id, tokens_awarded=10)
        db.session.add(ref)

        # --- Chat Messages ---
        chat = ChatMessage(sender_id=alice.id, recipient_id=bob.id, content="Interested in your vase!")
        db.session.add(chat)

        # --- Reports ---
        report = Report(reporter_id=bob.id, review_id=1, reason="Inappropriate language")
        db.session.add(report)

        # --- Trade History ---
        th = TradeHistory(
            item_id=item1.id,
            seller_id=alice.id,
            buyer_id=bob.id,
            price=250.00,
            currency_type="usd",
            date="2025-04-25"
        )
        db.session.add(th)

        # --- Trading Wrapped Summary ---
        tw = TradingWrapped(
            user_id=alice.id,
            total_trades=1,
            most_traded_category="instruments",
            top_item="Vintage Guitar",
            favorite_trader="Bob Smith",
            badges_earned="First Trade",
            trader_motto="Trade smart, live well",
            spirit_animal="Fox"
        )
        db.session.add(tw)

        # Commit all seed data
        db.session.commit()
        print("✅ Database has been seeded with initial data.")

if __name__ == "__main__":
    seed()
