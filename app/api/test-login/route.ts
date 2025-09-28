import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = body
    
    // Test dengan password yang kita tahu
    const testPasswords = ['admin123', 'admin', 'password', '123456', 'sekolah123']
    
    for (const testPassword of testPasswords) {
      const hashedPassword = await bcrypt.hash(testPassword, 12)
      console.log(`Testing password: ${testPassword}`)
      console.log(`Generated hash: ${hashedPassword}`)
      
      // Test compare
      const isValid = await bcrypt.compare(testPassword, hashedPassword)
      console.log(`Password ${testPassword} valid: ${isValid}`)
    }
    
    return NextResponse.json({
      message: 'Password test completed',
      testPasswords,
      note: 'Check console for results'
    })
    
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    )
  }
}

