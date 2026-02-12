import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

// Use your STRIPE_SECRET_KEY (server-side only)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export async function POST(req: NextRequest) {
  try {
    const { productName, billingType, totalAmount } = await req.json();

    if (!productName || !billingType || !totalAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert amount to cents
    const amountInCents = Math.round(totalAmount * 100);

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'aud',
      payment_method_types: ['card'],
      metadata: {
        productName,
        billingType,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('Stripe PaymentIntent error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}