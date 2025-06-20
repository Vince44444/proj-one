<template>
  <div class="home">
    <h1>Full Stack App - Users Management</h1>
    
    <!-- Health Check -->
    <div class="health-status" :class="healthStatus.status">
      API Status: {{ healthStatus.message }}
    </div>

    <!-- Add User Form -->
    <div class="user-form-container">
      <h2>Add New User</h2>
      <form @submit.prevent="createUser" class="user-form">
        <div class="form-group">
          <input 
            v-model="newUser.username" 
            placeholder="Username" 
            required 
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <input 
            v-model="newUser.email" 
            type="email" 
            placeholder="Email" 
            required 
            :disabled="loading"
          />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Adding...' : 'Add User' }}
        </button>
      </form>
    </div>

    <!-- Users List -->
    <div class="users-container">
      <h2>Users ({{ users.length }})</h2>
      <div v-if="loading && users.length === 0" class="loading">
        Loading users...
      </div>
      <div v-else-if="users.length === 0" class="no-users">
        No users found. Add some users above!
      </div>
      <div v-else class="users-list">
        <div v-for="user in users" :key="user.id" class="user-card">
          <div class="user-info">
            <strong>{{ user.username }}</strong>
            <span class="email">{{ user.email }}</span>
            <small v-if="user.created_at" class="date">
              Added: {{ formatDate(user.created_at) }}
            </small>
          </div>
          <button 
            @click="deleteUser(user.id)" 
            class="delete-btn"
            :disabled="loading"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { userService } from '@/services/api'

export default {
  name: 'HomeView',
  data() {
    return {
      users: [],
      newUser: {
        username: '',
        email: ''
      },
      loading: false,
      error: null,
      healthStatus: {
        status: 'unknown',
        message: 'Checking...'
      }
    }
  },
  async created() {
    await this.checkHealth()
    await this.fetchUsers()
  },
  methods: {
    async checkHealth() {
      try {
        const response = await userService.healthCheck()
        this.healthStatus = {
          status: 'healthy',
          message: `Healthy (${response.data.database})`
        }
      } catch (error) {
        this.healthStatus = {
          status: 'error',
          message: 'API Unavailable'
        }
      }
    },
    async fetchUsers() {
      try {
        this.loading = true
        this.error = null
        const response = await userService.getUsers()
        this.users = response.data
      } catch (error) {
        this.error = 'Failed to fetch users: ' + (error.response?.data?.error || error.message)
      } finally {
        this.loading = false
      }
    },
    async createUser() {
      try {
        this.loading = true
        this.error = null
        await userService.createUser(this.newUser)
        this.newUser = { username: '', email: '' }
        await this.fetchUsers()
      } catch (error) {
        this.error = 'Failed to create user: ' + (error.response?.data?.error || error.message)
      } finally {
        this.loading = false
      }
    },
    async deleteUser(userId) {
      if (!confirm('Are you sure you want to delete this user?')) return
      
      try {
        this.loading = true
        this.error = null
        await userService.deleteUser(userId)
        await this.fetchUsers()
      } catch (error) {
        this.error = 'Failed to delete user: ' + (error.response?.data?.error || error.message)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.health-status {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-weight: bold;
}

.health-status.healthy {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.health-status.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.user-form-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.user-form button {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.user-form button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.users-container {
  margin-top: 30px;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.email {
  color: #6c757d;
}

.date {
  color: #888;
}

.delete-btn {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.loading, .no-users {
  text-align: center;
  padding: 20px;
  color: #6c757d;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}
</style>