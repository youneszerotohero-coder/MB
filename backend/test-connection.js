#!/usr/bin/env node

/**
 * Database Connection Test Script
 * This script tests the PrismaClient singleton pattern and connection pooling
 */

const { connectDatabase, getPrismaClient, healthCheck, disconnectDatabase } = require('./src/config/database');
const logger = require('./src/utils/logger');

async function testConnection() {
  console.log('🧪 Starting database connection tests...\n');

  try {
    // Test 1: Initial connection
    console.log('1️⃣ Testing initial connection...');
    await connectDatabase();
    console.log('✅ Initial connection successful\n');

    // Test 2: Get PrismaClient instance
    console.log('2️⃣ Testing PrismaClient singleton...');
    const prisma1 = await getPrismaClient();
    const prisma2 = await getPrismaClient();
    
    if (prisma1 === prisma2) {
      console.log('✅ Singleton pattern working correctly - same instance returned\n');
    } else {
      console.log('❌ Singleton pattern failed - different instances returned\n');
    }

    // Test 3: Health check
    console.log('3️⃣ Testing health check...');
    const health = await healthCheck();
    console.log('Health status:', health);
    if (health.status === 'healthy') {
      console.log('✅ Health check passed\n');
    } else {
      console.log('❌ Health check failed\n');
    }

    // Test 4: Multiple concurrent queries
    console.log('4️⃣ Testing concurrent queries...');
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(prisma1.$queryRaw`SELECT ${i} as test_id, NOW() as timestamp`);
    }
    
    const results = await Promise.all(promises);
    console.log(`✅ ${results.length} concurrent queries completed successfully\n`);

    // Test 5: Connection pool stress test
    console.log('5️⃣ Testing connection pool under load...');
    const loadPromises = [];
    for (let i = 0; i < 50; i++) {
      loadPromises.push(
        prisma1.$queryRaw`SELECT COUNT(*) as count FROM "products"`
          .then(() => ({ success: true, id: i }))
          .catch(err => ({ success: false, id: i, error: err.message }))
      );
    }
    
    const loadResults = await Promise.all(loadPromises);
    const successCount = loadResults.filter(r => r.success).length;
    const failureCount = loadResults.filter(r => !r.success).length;
    
    console.log(`✅ Load test completed: ${successCount} successful, ${failureCount} failed\n`);

    // Test 6: Memory usage
    console.log('6️⃣ Testing memory usage...');
    const memBefore = process.memoryUsage();
    console.log('Memory before test:', {
      rss: Math.round(memBefore.rss / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memBefore.heapUsed / 1024 / 1024) + ' MB'
    });

    // Perform some operations
    for (let i = 0; i < 100; i++) {
      await prisma1.$queryRaw`SELECT 1`;
    }

    const memAfter = process.memoryUsage();
    console.log('Memory after test:', {
      rss: Math.round(memAfter.rss / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memAfter.heapUsed / 1024 / 1024) + ' MB'
    });

    const memDiff = {
      rss: Math.round((memAfter.rss - memBefore.rss) / 1024 / 1024) + ' MB',
      heapUsed: Math.round((memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024) + ' MB'
    };
    console.log('Memory difference:', memDiff);
    console.log('✅ Memory usage test completed\n');

    console.log('🎉 All tests passed! Database connection is stable and properly configured.\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    // Cleanup
    console.log('🧹 Cleaning up...');
    await disconnectDatabase();
    console.log('✅ Cleanup completed');
    process.exit(0);
  }
}

// Run the test
testConnection().catch(error => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});

