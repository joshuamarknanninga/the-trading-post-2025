# backend/utils/qr_generator.py

import qrcode
from qrcode.image.pil import PilImage

def generate_qr_code(data: str, box_size: int = 10, border: int = 4) -> PilImage:
    """
    Generates a QR code image for the given data string.

    Args:
        data (str): The string or URL to encode in the QR code.
        box_size (int): How many pixels each “box” of the QR code is.
        border (int): How many boxes thick the border should be (minimum is 4 per spec).

    Returns:
        PilImage: A PIL Image object of the generated QR code.
    """
    # Create QRCode object with desired settings
    qr = qrcode.QRCode(
        version=None,  # automatic sizing
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=box_size,
        border=border,
    )
    qr.add_data(data)
    qr.make(fit=True)

    # Generate the PIL image (defaults to black on white)
    img: PilImage = qr.make_image(fill_color="black", back_color="white")
    return img
