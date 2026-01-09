<script setup>
definePageMeta({
  layout: false
})

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css' }
  ]
})

const step = ref(1)
const email = ref('')
const otp = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const handleSendOTP = () => {
    if (!email.value) return
    loading.value = true
    // Simulate API call
    setTimeout(() => {
        loading.value = false
        step.value = 2
    }, 1000)
}

const handleVerifyOTP = () => {
    if (!otp.value) return
    loading.value = true
    // Simulate API call
    setTimeout(() => {
        loading.value = false
        step.value = 3
    }, 1000)
}

const handleResetPassword = async () => {
    if (!password.value || password.value !== confirmPassword.value) return
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    loading.value = false
    // Redirect to login or show success
    await navigateTo('/login')
}
</script>

<template>
  <div class="login-wrapper">
    <div class="auth-container" id="container">
      <div class="form-container">
        <div class="form-content">
            <!-- Step 1: Email -->
            <transition name="slide-fade" mode="out-in">
                <form v-if="step === 1" @submit.prevent="handleSendOTP" key="step1">
                    <h1>Forgot Password</h1>
                    <span>Enter your email to receive an OTP</span>
                    <input type="email" placeholder="Email" v-model="email" required>
                    <button type="submit" :disabled="loading">
                        {{ loading ? 'Sending...' : 'Send OTP' }}
                    </button>
                    <NuxtLink to="/login" class="back-link">Back to Sign In</NuxtLink>
                </form>

                <!-- Step 2: OTP -->
                <form v-else-if="step === 2" @submit.prevent="handleVerifyOTP" key="step2">
                    <h1>Verify OTP</h1>
                    <span>Enter the OTP sent to your email</span>
                    <input type="text" placeholder="Enter OTP" v-model="otp" required>
                    <button type="submit" :disabled="loading">
                        {{ loading ? 'Verifying...' : 'Verify OTP' }}
                    </button>
                    <a href="#" @click.prevent="step = 1" class="back-link">Change Email</a>
                </form>

                <!-- Step 3: Reset Password -->
                <form v-else-if="step === 3" @submit.prevent="handleResetPassword" key="step3">
                    <h1>Reset Password</h1>
                    <span>Create a new password</span>
                    <input type="password" placeholder="New Password" v-model="password" required>
                    <input type="password" placeholder="Confirm Password" v-model="confirmPassword" required>
                    <button type="submit" :disabled="loading">
                        {{ loading ? 'Saving...' : 'Save Password' }}
                    </button>
                </form>
            </transition>
        </div>
      </div>
      
      <!-- Using the toggle container for visual consistency with login page -->
      <div class="toggle-container">
        <div class="toggle">
          <div class="toggle-panel toggle-right">
            <h1>Reset Password</h1>
            <p>Follow the steps to recover your account access.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

.login-wrapper {
  background-color: #c9d6ff;
  background: linear-gradient(to right, #e2e2e2, #c9d6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
}

.auth-container {
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
  position: relative;
  overflow: hidden;
  width: 1000px;
  max-width: 100%;
  min-height: 600px;
}

.auth-container span {
  font-size: 12px;
  margin-bottom: 15px;
}

.auth-container button {
  background-color: #512da8;
  color: #fff;
  font-size: 12px;
  padding: 10px 45px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-top: 10px;
  cursor: pointer;
}

.auth-container form {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  height: 100%;
  width: 100%;
}

.auth-container input {
  background-color: #eee;
  border: none;
  margin: 8px 0;
  padding: 10px 15px;
  font-size: 13px;
  border-radius: 8px;
  width: 100%;
  outline: none;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  left: 0;
  z-index: 2;
  transition: all 0.6s ease-in-out;
}

.form-content {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
  border-radius: 150px 0 0 100px; /* Matching the "right" styling of login page */
  z-index: 1000;
}

.toggle {
  background-color: #512da8;
  height: 100%;
  background: linear-gradient(to right, #5c6bc0, #512da8);
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
}

.toggle-panel {
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 30px;
  text-align: center;
  top: 0;
  transform: translateX(0);
}

.toggle-right {
  right: 0;
  transform: translateX(0);
}

.back-link {
    margin-top: 15px;
    font-size: 12px;
    color: #333;
    text-decoration: none;
    cursor: pointer;
}

/* Transitions */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
